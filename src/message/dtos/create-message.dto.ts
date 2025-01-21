import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Reason } from "../enums";

export default class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Reason)
  @IsNotEmpty()
  reason: Reason;

  @IsString()
  @IsNotEmpty()
  email: string;
}
