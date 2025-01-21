import { IsString } from "class-validator";

export default class PackageIdReviewerIdDTO {
  @IsString()
  packageId: string;

  @IsString()
  reviewerId: string;
}
