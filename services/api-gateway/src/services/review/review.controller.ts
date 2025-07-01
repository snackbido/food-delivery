import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetReviewsDto) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Get('restaurant/:restaurantId')
  @HttpCode(HttpStatus.OK)
  async getRestaurantRating(@Param('restaurantId') restaurantId: string) {
    return this.reviewService.getRestaurantRating(restaurantId);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserReviews(
    @Param('userId') userId: string,
    @Query() query: GetReviewsDto,
  ) {
    return this.reviewService.getUserReviews(userId, query);
  }

  @Get('restaurant/:restaurantId/reviews')
  @HttpCode(HttpStatus.OK)
  async getRestaurantReviews(
    @Param('restaurantId') restaurantId: string,
    @Query() query: GetReviewsDto,
  ) {
    return this.reviewService.getRestaurantReviews(restaurantId, query);
  }
  @Get('check-reviewed/:restaurantId/:userId')
  @HttpCode(HttpStatus.OK)
  async checkUserReviewed(
    @Param('restaurantId') restaurantId: string,
    @Param('userId') userId: string,
  ) {
    return this.reviewService.checkUserReviewed(restaurantId, userId);
  }
}
