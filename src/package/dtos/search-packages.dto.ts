import { IsString } from "class-validator";
import { GetModelsDTO } from "../../global/dtos/get-models.dto";

export default class SearchPackagesDTO extends GetModelsDTO {
  @IsString()
  search: string;
}
