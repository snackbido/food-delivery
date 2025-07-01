import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateReviewDto } from '@review/dto/create-review.dto';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['user_id', 'restaurant_id', 'order_id'] as const),
) {}
