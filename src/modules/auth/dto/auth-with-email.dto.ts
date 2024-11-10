import { ApiProperty } from '@nestjs/swagger';
import { countries, names, uniqueNamesGenerator } from 'unique-names-generator';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRoleEnum } from '../../../infra/shared/enum';
import { GenerateCharackters, GenerateLogin } from '../../../infra/utils';

function nameGenerate() {
  return uniqueNamesGenerator({ dictionaries: [names], style: 'capital' });
}

function surnameGenerate() {
  return uniqueNamesGenerator({ dictionaries: [countries], style: 'capital' });
}

class AuthWithEmailPayloadDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Getter TEAM',
    required: false,
  })
  @IsString()
  company: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @ApiProperty({
    description: 'Email',
    example: 'Something@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Role',
    example: 1,
    required: true,
  })
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  @IsNumber()
  role: number;

  constructor() {
    this.firstName = nameGenerate();
    this.lastName = surnameGenerate();
    this.password = GenerateCharackters(8);
    this.login = GenerateLogin();
  }
}

export default AuthWithEmailPayloadDto;