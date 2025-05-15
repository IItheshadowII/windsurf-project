import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string = '';

  @IsString()
  @MinLength(6)
  password: string = '';

  @IsString()
  name: string = '';

  constructor(partial?: Partial<RegisterDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
