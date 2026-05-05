import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FuenteLead, LeadEstado } from '../../../Domain/Lead/value-objects/lead.enums';

export class ActualizarLeadDto {
  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

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

  @ApiPropertyOptional({ example: 'Problema actualizado' })
  @IsOptional()
  @IsString()
  problema?: string;

  @ApiPropertyOptional({ enum: FuenteLead })
  @IsOptional()
  @IsEnum(FuenteLead)
  fuente?: FuenteLead;

  @ApiPropertyOptional({ enum: LeadEstado })
  @IsOptional()
  @IsEnum(LeadEstado)
  estado?: LeadEstado;

  @ApiPropertyOptional({ example: 8000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_estimado?: number;
}
