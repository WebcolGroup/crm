import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../Infrastructure/Auth/jwt-auth.guard';
import { ObtenerMetricasUseCase } from '../../../Application/Dashboard/use-cases/obtener-metricas.use-case';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly obtenerMetricas: ObtenerMetricasUseCase) {}

  /**
   * GET /dashboard/metricas
   * Retorna métricas clave del pipeline:
   * - Total leads, leads HOT
   * - Valor del pipeline y ventas cerradas
   * - Tasa de conversión
   * - Leads por estado (para Kanban)
   * - Leads de los últimos 7 días
   */
  @Get('metricas')
  @ApiOperation({ summary: 'Métricas del pipeline de ventas' })
  metricas() {
    return this.obtenerMetricas.ejecutar();
  }
}
