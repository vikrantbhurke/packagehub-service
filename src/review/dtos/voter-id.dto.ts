import { IsString } from "class-validator";

export default class VoterIdDTO {
  @IsString()
  upvoterIds?: string;

  @IsString()
  downvoterIds?: string;
}
