import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../Infrastructure/Auth/jwt-auth.guard';
import { RegistrarVentaUseCase } from '../../../Application/Venta/use-cases/registrar-venta.use-case';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoVenta } from '../../../Domain/Lead/entities/venta.entity';

class RegistrarVentaDto {
  @ApiProperty({ example: 'uuid-del-lead' })
  @IsUUID()
  lead_id: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiPropertyOptional({ enum: EstadoVenta, default: EstadoVenta.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoVenta)
  estado?: EstadoVenta;

  @ApiPropertyOptional({ example: 'Venta cerrada en llamada del 5 mayo' })
  @IsOptional()
  @IsString()
  notas?: string;
}

@ApiTags('Ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly registrarVenta: RegistrarVentaUseCase) {}

  /**
   * POST /ventas
   * Registra una venta asociada a un lead.
   * Si estado = "cerrada", mueve el lead automáticamente al estado "cerrado".
   *
   * Body: { lead_id, valor, estado?, notas? }
   */
  @Post()
  @ApiOperation({ summary: 'Registrar venta' })
  registrar(@Body() dto: RegistrarVentaDto) {
    return this.registrarVenta.ejecutar(dto);
  }
}
