import { ReviewError } from "../review.error";
import { IsNumber, IsOptional, IsString } from "class-validator";

export default class CreateNextReviewDTO {
  @IsOptional()
  @IsString({
    message: ReviewError.Id,
  })
  id: string;

  @IsString({
    message: ReviewError.Title,
  })
  title: string;

  @IsString({
    message: ReviewError.Body,
  })
  body: string;

  @IsString()
  packageId: string;

  @IsString()
  reviewerId: string;

  @IsNumber()
  rating: number;
}
