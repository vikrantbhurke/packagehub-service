import { IsString } from "class-validator";

export default class PackageIdDTO {
  @IsString()
  packageId: string;
}
