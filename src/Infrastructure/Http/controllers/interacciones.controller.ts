import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../Infrastructure/Auth/jwt-auth.guard';
import { RegistrarInteraccionUseCase } from '../../../Application/Interaccion/use-cases/registrar-interaccion.use-case';
import { RegistrarInteraccionDto } from '../../../Application/Interaccion/dtos/registrar-interaccion.dto';

@ApiTags('Interacciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interacciones')
export class InteraccionesController {
  constructor(private readonly registrarInteraccion: RegistrarInteraccionUseCase) {}

  /**
   * POST /interacciones
   * Registra un contacto (email, WhatsApp, llamada) con un lead.
   * Recalcula el score automáticamente.
   *
   * Body: { lead_id, tipo: "whatsapp"|"email"|"llamada", mensaje? }
   */
  @Post()
  @ApiOperation({ summary: 'Registrar interacción con un lead' })
  registrar(@Body() dto: RegistrarInteraccionDto) {
    return this.registrarInteraccion.ejecutar(dto);
  }
}
