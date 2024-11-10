import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class AuthPayloadDto {
  @ApiProperty({
    description: `phone`,
    example: '+998909878776',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: `OTP`,
    example: '1234',
  })
  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export default AuthPayloadDto;