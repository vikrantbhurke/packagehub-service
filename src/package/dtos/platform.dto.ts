import { IsEnum } from "class-validator";
import { Platform } from "../platform.enum";

export default class PlatformDTO {
  @IsEnum(Platform)
  platform: Platform;
}
