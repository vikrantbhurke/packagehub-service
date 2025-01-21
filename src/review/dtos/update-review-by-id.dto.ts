import { Schema } from "mongoose";
import { ReviewError } from "../review.error";
import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export default class UpdateReviewByIdDTO {
  @IsOptional()
  @IsMongoId({
    message: ReviewError.Id,
  })
  id: Schema.Types.ObjectId;

  @IsOptional()
  @IsString({
    message: ReviewError.Title,
  })
  title: string;

  @IsOptional()
  @IsString({
    message: ReviewError.Body,
  })
  body: string;

  @IsOptional()
  @IsNumber()
  rating: number;
}
