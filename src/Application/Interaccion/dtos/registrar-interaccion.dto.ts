import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoInteraccion } from '../../../Domain/Lead/entities/interaccion.entity';

export class RegistrarInteraccionDto {
  @ApiProperty({ example: 'uuid-del-lead' })
  @IsString()
  lead_id: string;

  @ApiProperty({ enum: TipoInteraccion, example: TipoInteraccion.WHATSAPP })
  @IsEnum(TipoInteraccion)
  tipo: TipoInteraccion;

  @ApiPropertyOptional({ example: 'Se envió propuesta por WhatsApp' })
  @IsOptional()
  @IsString()
  mensaje?: string;
}
