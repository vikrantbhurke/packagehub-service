import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { UserError } from "../user.error";

export default class SignUpUserDTO {
  @IsAlpha(undefined, {
    message: UserError.Firstname,
  })
  firstname: string;

  @IsString({
    message: UserError.Lastname,
  })
  lastname: string;

  @IsString({
    message: UserError.Username,
  })
  username: string;

  @IsStrongPassword(undefined, {
    message: UserError.Password,
  })
  password: string;

  @IsEmail(undefined, {
    message: UserError.Email,
  })
  email: string;
}
