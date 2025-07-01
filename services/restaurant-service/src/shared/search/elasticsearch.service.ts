import { Client } from '@elastic/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchRestaurantDto } from '@restaurant/dto/search_restaurant.dto';
import { Restaurant } from '@restaurant/entity/restaurant.entity';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;
  private readonly index = 'restaurant';
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor(configService: ConfigService) {
    this.client = new Client({
      node: configService.get<string>('ELASTICSEARCH_URL'),
    });
    this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      const exists = await this.client.indices.exists({ index: this.index });
      if (!exists) {
        await this.client.indices.create({
          index: this.index,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                name: {
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                description: { type: 'text' },
                address: { type: 'text' },
                rating: { type: 'float' },
                total_reviews: { type: 'integer' },
                delivery_fee: { type: 'float' },
                estimated_delivery_time: { type: 'integer' },
                is_active: { type: 'boolean' },
                is_featured: { type: 'boolean' },
                location: { type: 'geo_point' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' },
              },
            },
          },
        });
      }
      this.logger.log('index mapped');
    } catch (error) {
      this.logger.log('Failed to initialize Elasticsearch index', error);
    }
  }

  async indexRestaurant(restaurant: Restaurant): Promise<void> {
    try {
      await this.client.index({
        index: this.index,
        id: restaurant.id,
        body: {
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          location: {
            lat: restaurant.latitude,
            lon: restaurant.longitude,
          },
          phone: restaurant.phone,
          email: restaurant.email,
          is_active: restaurant.is_active,
          rating: restaurant.rating,
          total_reviews: restaurant.total_reviews,
          estimated_delivery_time: restaurant.estimated_delivery_time,
          opening_hours: restaurant.opening_hours,
          images: restaurant.images,
        },
      });
      this.logger.log(`Created index ${this.index}`);
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  async update(id: string, restaurant: Restaurant): Promise<void> {
    try {
      await this.client.update({
        index: this.index,
        id,
        doc: restaurant,
      });
      this.logger.log('Restaurant elasticsearch has been updated');
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.index,
        id,
      });
      this.logger.log('Restaurant elasticsearch has been deleted');
    } catch (error) {
      this.logger.error(`Failed to delete restaurant ${id}`, error);
    }
  }

  async search(searchRestaurantDto: SearchRestaurantDto): Promise<any> {
    try {
      const {
        query,
        latitude,
        longitude,
        radius,
        min_rating,
        page = 1,
        limit = 10,
      } = searchRestaurantDto;

      const must: any[] = [{ term: { is_active: true } }];
      if (query) {
        must.push({
          multi_match: {
            query: query,
            fields: ['name^2', 'description'],
            fuzziness: 'AUTO',
          },
        });
      }

      if (min_rating) {
        must.push({
          range: {
            rating: { gte: min_rating },
          },
        });
      }

      const searchQuery: any = {
        index: this.index,
        body: {
          query: {
            bool: { must },
          },
          from: (page - 1) * limit,
          size: limit,
          sort: [{ rating: { order: 'desc' } }, { _score: { order: 'desc' } }],
        },
      };

      if (latitude && longitude && radius) {
        searchQuery.body.query.bool.filter = {
          geo_distance: {
            distance: `${radius}km`,
            location: {
              lat: latitude * 1,
              lon: longitude * 1,
            },
          },
        };

        // Add distance sorting
        searchQuery.body.sort.unshift({
          _geo_distance: {
            location: {
              lat: latitude * 1,
              lon: longitude * 1,
            },
            order: 'asc',
            unit: 'km',
          },
        });
      }

      const response = await this.client.search(searchQuery);
      const restaurants = response.hits.hits.map((hit) => hit._source);

      const total = response.hits.total.valueOf();

      return { restaurants, total };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async searchNearBy(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<string[]> {
    try {
      const searchQuery: any = {
        index: this.index,
        body: {
          query: {
            bool: {
              must: [{ term: { is_active: true } }],
              filter: {
                geo_distance: {
                  distance: `${radius}km`,
                  location: {
                    lat: lat,
                    lon: lng,
                  },
                },
              },
            },
          },
          sort: [
            {
              _geo_distance: {
                location: {
                  lat: lat,
                  lon: lng,
                },
                order: 'asc',
                unit: 'km',
              },
            },
          ],
          size: 20,
        },
      };

      const response = await this.client.search(searchQuery);
      const restaurants = response.hits.hits.map((hit) => hit._id);
      console.log(restaurants);

      return restaurants;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
