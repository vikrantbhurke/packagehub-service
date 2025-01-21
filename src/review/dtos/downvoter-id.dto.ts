import { IsString } from "class-validator";

export default class DownvoterIdDTO {
  @IsString()
  downvoterIds: string;
}
