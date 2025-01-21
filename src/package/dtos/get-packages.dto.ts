import { IsOptional } from "class-validator";
import { GetModelsDTO } from "../../global/dtos/get-models.dto";

export default class GetPackagesDTO extends GetModelsDTO {
  @IsOptional()
  rating?: number | object;
}
