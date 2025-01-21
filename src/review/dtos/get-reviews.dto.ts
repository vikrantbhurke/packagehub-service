import { IsNumber, IsOptional } from "class-validator";
import { GetModelsDTO } from "../../global/dtos/get-models.dto";

export default class GetReviewsDTO extends GetModelsDTO {
  @IsOptional()
  @IsNumber()
  rating?: number;
}
