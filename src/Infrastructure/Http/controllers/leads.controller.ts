import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../Infrastructure/Auth/jwt-auth.guard';
import { CrearLeadUseCase } from '../../../Application/Lead/use-cases/crear-lead.use-case';
import { ActualizarLeadUseCase } from '../../../Application/Lead/use-cases/actualizar-lead.use-case';
import { ListarLeadsUseCase } from '../../../Application/Lead/use-cases/listar-leads.use-case';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { CrearLeadDto } from '../../../Application/Lead/dtos/crear-lead.dto';
import { ActualizarLeadDto } from '../../../Application/Lead/dtos/actualizar-lead.dto';
import { FiltroLeadsDto } from '../../../Application/Lead/dtos/filtro-leads.dto';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly crearLead: CrearLeadUseCase,
    private readonly actualizarLead: ActualizarLeadUseCase,
    private readonly listarLeads: ListarLeadsUseCase,
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
  ) {}

  /**
   * POST /leads
   * Crea un nuevo lead en el CRM.
   * n8n puede llamar este endpoint directamente al recibir un formulario de landing.
   *
   * Body: { nombre, email, telefono?, empresa?, problema?, fuente?, valor_estimado? }
   */
  @Post()
  @ApiOperation({ summary: 'Crear nuevo lead' })
  crear(@Body() dto: CrearLeadDto) {
    return this.crearLead.ejecutar(dto);
  }

  /**
   * GET /leads
   * Lista leads con filtros opcionales: nivel=HOT, estado=contactado, busqueda=juan, pagina=1, limite=20
   */
  @Get()
  @ApiOperation({ summary: 'Listar leads con filtros' })
  listar(@Query() filtros: FiltroLeadsDto) {
    return this.listarLeads.ejecutar(filtros);
  }

  /**
   * GET /leads/:id
   * Retorna un lead con sus interacciones, citas y ventas.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener lead por ID' })
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadRepo.buscarPorId(id);
  }

  /**
   * PATCH /leads/:id
   * Actualiza estado, datos o score de un lead.
   * n8n usa este endpoint para mover el lead en el pipeline.
   *
   * Body: { estado?, empresa?, problema?, valor_estimado?, fuente? }
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar lead' })
  actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActualizarLeadDto) {
    return this.actualizarLead.ejecutar(id, dto);
  }
}
