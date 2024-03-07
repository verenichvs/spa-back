import { IsAlphanumeric, IsEmail } from 'class-validator';

export class ReturnUserDto {
  @IsAlphanumeric()
  username: string;
  @IsEmail()
  email: string;
}
