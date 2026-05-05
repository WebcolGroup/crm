import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FuenteLead } from '../../../Domain/Lead/value-objects/lead.enums';

export class CrearLeadDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+573001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @ApiPropertyOptional({ example: 'Empresa S.A.' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  empresa?: string;

  @ApiPropertyOptional({ example: 'Necesita automatizar su proceso de facturación' })
  @IsOptional()
  @IsString()
  problema?: string;

  @ApiPropertyOptional({ enum: FuenteLead, example: FuenteLead.ADS })
  @IsOptional()
  @IsEnum(FuenteLead)
  fuente?: FuenteLead;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_estimado?: number;
}
