import { IsString } from "class-validator";

export default class ReviewerIdDTO {
  @IsString()
  reviewerId: string;
}
