import { IsString } from "class-validator";

export default class UpvoterIdDTO {
  @IsString()
  upvoterIds: string;
}
