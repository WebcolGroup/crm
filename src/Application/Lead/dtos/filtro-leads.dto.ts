import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { FuenteLead, LeadEstado, LeadNivel } from '../../../Domain/Lead/value-objects/lead.enums';

export class FiltroLeadsDto {
  @ApiPropertyOptional({ enum: LeadNivel })
  @IsOptional()
  @IsEnum(LeadNivel)
  nivel?: LeadNivel;

  @ApiPropertyOptional({ enum: LeadEstado })
  @IsOptional()
  @IsEnum(LeadEstado)
  estado?: LeadEstado;

  @ApiPropertyOptional({ enum: FuenteLead })
  @IsOptional()
  @IsEnum(FuenteLead)
  fuente?: FuenteLead;

  @ApiPropertyOptional({ example: 'juan' })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limite?: number = 20;
}
