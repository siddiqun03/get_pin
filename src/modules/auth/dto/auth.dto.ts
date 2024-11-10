import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class AuthPayloadDto {
  @ApiProperty({
    description: `Admin login`,
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: `Admin password`,
    example: 'dms#sjdn%async',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export default AuthPayloadDto;