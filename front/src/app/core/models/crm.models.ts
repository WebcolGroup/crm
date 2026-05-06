export type LeadNivel = 'HOT' | 'WARM' | 'COLD';
export type LeadEstado =
  | 'NUEVO'
  | 'CALIFICADO'
  | 'CONTACTADO'
  | 'CITA_AGENDADA'
  | 'CITA_REALIZADA'
  | 'CERRADO'
  | 'PERDIDO';
export type FuenteLead = 'ADS' | 'LINKEDIN' | 'REFERIDO' | 'ORGANICO' | 'LANDING' | 'OTRO';
export type TipoInteraccion = 'EMAIL' | 'WHATSAPP' | 'LLAMADA' | 'NOTA';
export type EstadoCita = 'AGENDADA' | 'REALIZADA' | 'NO_SHOW' | 'CANCELADA';
export type EstadoVenta = 'PENDIENTE' | 'CERRADA' | 'PERDIDA';

export interface Interaccion {
  id: string;
  lead_id: string;
  tipo: TipoInteraccion;
  mensaje?: string;
  fecha: string;
}

export interface Cita {
  id: string;
  lead_id: string;
  fecha: string;
  estado: EstadoCita;
  url_reunion?: string;
  calendly_event_id?: string;
  creado_en: string;
}

export interface Venta {
  id: string;
  lead_id: string;
  valor: number;
  estado: EstadoVenta;
  notas?: string;
  fecha_cierre: string;
}

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  problema?: string;
  fuente: FuenteLead;
  score: number;
  nivel: LeadNivel;
  estado: LeadEstado;
  valor_estimado?: number;
  fecha_creacion: string;
  ultima_interaccion?: string;
  actualizado_en: string;
  interacciones?: Interaccion[];
  citas?: Cita[];
  ventas?: Venta[];
}

export interface LeadFiltros {
  nivel?: LeadNivel;
  estado?: LeadEstado;
  fuente?: FuenteLead;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface CrearLeadDto {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  problema?: string;
  fuente?: FuenteLead;
  valor_estimado?: number;
}

export interface ActualizarLeadDto {
  nombre?: string;
  telefono?: string;
  empresa?: string;
  problema?: string;
  fuente?: FuenteLead;
  estado?: LeadEstado;
  valor_estimado?: number;
}

export interface RegistrarInteraccionDto {
  lead_id: string;
  tipo: TipoInteraccion;
  mensaje?: string;
}

export interface RegistrarVentaDto {
  lead_id: string;
  valor: number;
  estado?: EstadoVenta;
  notas?: string;
}

export interface DashboardMetricas {
  totalLeads: number;
  leadsHOT: number;
  pipelineValue: number;
  closedSales: number;
  conversionRate: number;
  leadsByState: Record<string, number>;
  last7DaysLeads: number[];
}
