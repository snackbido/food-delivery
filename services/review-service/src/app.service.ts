import { RpcException } from '@nestjs/microservices';
import { Review } from '@review/entity/review.entity';
import { ReviewRepository } from '@review/repository/review.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { GetReviewsDto } from '@review/dto/get-review.dto';
import { UpdateReviewDto } from '@review/dto/update-review.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if user already reviewed this restaurant
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: createReviewDto.user_id,
        restaurant_id: createReviewDto.restaurant_id,
      },
    });

    if (existingReview) {
      throw new RpcException('User has already reviewed this restaurant');
    }

    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findAll(getReviewsDto: GetReviewsDto) {
    const {
      page = 1,
      limit = 10,
      restaurant_id,
      user_id,
      rating,
    } = getReviewsDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.is_active = :is_active', { is_active: true });

    if (restaurant_id) {
      queryBuilder.andWhere('review.restaurant_id = :restaurantId', {
        restaurantId: restaurant_id,
      });
    }

    if (user_id) {
      queryBuilder.andWhere('review.userId = :userId', { userId: user_id });
    }

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    const [reviews, total] = await queryBuilder
      .orderBy('review.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, is_active: true },
    });

    if (!review) {
      throw new RpcException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    review.is_active = false;
    await this.reviewRepository.save(review);
  }

  async getRestaurantReviews(restaurantId: string, query: GetReviewsDto) {
    return this.findAll({ ...query, restaurant_id: restaurantId });
  }

  async getUserReviews(userId: string, query: GetReviewsDto) {
    return this.findAll({ ...query, user_id: userId });
  }

  async getRestaurantRating(restaurantId: string) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'AVG(review.rating) as averageRating',
        'COUNT(review.id) as totalReviews',
        'COUNT(CASE WHEN review.rating = 5 THEN 1 END) as fiveStars',
        'COUNT(CASE WHEN review.rating = 4 THEN 1 END) as fourStars',
        'COUNT(CASE WHEN review.rating = 3 THEN 1 END) as threeStars',
        'COUNT(CASE WHEN review.rating = 2 THEN 1 END) as twoStars',
        'COUNT(CASE WHEN review.rating = 1 THEN 1 END) as oneStar',
      ])
      .where('review.restaurant_id = :restaurantId', { restaurantId })
      .andWhere('review.is_active = :isActive', { isActive: true })
      .getRawOne();

    return {
      restaurantId,
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0,
      ratingDistribution: {
        5: parseInt(result.fiveStars) || 0,
        4: parseInt(result.fourStars) || 0,
        3: parseInt(result.threeStars) || 0,
        2: parseInt(result.twoStars) || 0,
        1: parseInt(result.oneStar) || 0,
      },
    };
  }

  async checkUserReviewed(
    userId: string,
    restaurantId: string,
  ): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { user_id: userId, restaurant_id: restaurantId, is_active: true },
    });

    return !!review;
  }
}
