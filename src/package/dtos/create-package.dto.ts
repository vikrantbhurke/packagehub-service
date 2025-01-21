import { IsEnum, IsNumber, IsString } from "class-validator";
import { Platform } from "../platform.enum";

export default class CreatePackageDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  reviews: number;

  @IsString()
  homepageUrl: string;

  @IsString()
  packageUrl: string;

  @IsEnum(Platform)
  platform: Platform;
}
