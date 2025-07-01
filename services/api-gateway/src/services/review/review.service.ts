import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(@Inject('REVIEW_SERVICE') private clientProxy: ClientProxy) {}

  async handleProxy(pattern: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send(pattern, data),
      );

      if (response.error) throw new BadGatewayException(response.error);

      return response;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
  async create(createReviewDto: CreateReviewDto) {
    return this.handleProxy('create', createReviewDto);
  }

  async findAll(getReviewsDto: GetReviewsDto) {
    return this.handleProxy('findAll', getReviewsDto);
  }

  async findOne(id: string) {
    return this.handleProxy('findOne', { id });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.handleProxy('update', { id, ...updateReviewDto });
  }

  async remove(id: string) {
    return this.handleProxy('remove', { id });
  }

  async getRestaurantReviews(
    restaurantId: string,
    getReviewsDto: GetReviewsDto,
  ) {
    return this.handleProxy('getRestaurantReviews', {
      restaurantId,
      ...getReviewsDto,
    });
  }

  async getUserReviews(userId: string, getReviewsDto: GetReviewsDto) {
    return this.handleProxy('getUserReviews', {
      userId,
      ...getReviewsDto,
    });
  }

  async getRestaurantRating(restaurantId: string) {
    return this.handleProxy('getRestaurantRating', { restaurantId });
  }

  async checkUserReviewed(restaurantId: string, userId: string) {
    return this.handleProxy('checkUserReviewed', { restaurantId, userId });
  }
}
