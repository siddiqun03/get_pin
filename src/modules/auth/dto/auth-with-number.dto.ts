import { ApiProperty } from '@nestjs/swagger';
import { countries, names, uniqueNamesGenerator } from 'unique-names-generator';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRoleEnum } from '../../../infra/shared/enum';

function nameGenerate() {
  return uniqueNamesGenerator({ dictionaries: [names], style: 'capital' });
}

function surnameGenerate() {
  return uniqueNamesGenerator({ dictionaries: [countries], style: 'capital' });
}

function generateCharacters(length) {
  const charset = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33)).join('');
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
}

class AuthWithNumberPayloadDto {
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
    description: 'phone',
    example: '+998909878776',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

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
    this.password = generateCharacters(8);
    this.login = generateCharacters(10);
  }
}

export default AuthWithNumberPayloadDto;