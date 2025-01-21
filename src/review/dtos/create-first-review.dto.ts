import { ReviewError } from "../review.error";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Platform } from "../../package/platform.enum";

export default class CreateFirstReviewDTO {
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

  @IsEnum(Platform)
  platform: Platform;

  @IsString()
  packageUrl: string;

  @IsString()
  homepageUrl: string;

  @IsString()
  description: string;
}
