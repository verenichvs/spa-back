import { IsAlphanumeric, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  username: string;
  @IsEmail()
  email: string;
  @MinLength(7, { message: 'password must be more then 6 symbols' })
  @IsAlphanumeric()
  password: string;
}
