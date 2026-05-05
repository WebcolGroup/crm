import { Lead } from '../../Domain/Lead/entities/lead.entity';
import { LeadEstado, LeadNivel } from '../../Domain/Lead/value-objects/lead.enums';

export interface FiltrosLead {
  nivel?: LeadNivel;
  estado?: LeadEstado;
  fuente?: string;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
}

// Puerto que define el contrato de persistencia para leads.
// Los adaptadores (TypeORM, en memoria, etc.) implementan este contrato.
export abstract class LeadRepositoryPort {
  abstract crear(lead: Partial<Lead>): Promise<Lead>;
  abstract buscarPorId(id: string): Promise<Lead | null>;
  abstract buscarPorEmail(email: string): Promise<Lead | null>;
  abstract listar(filtros: FiltrosLead): Promise<ResultadoPaginado<Lead>>;
  abstract actualizar(id: string, datos: Partial<Lead>): Promise<Lead>;
  abstract listarHot(): Promise<Lead[]>;
  abstract contarPorEstado(): Promise<{ estado: string; total: number }[]>;
  abstract valorTotalPipeline(): Promise<number>;
  abstract tasaConversion(): Promise<number>;
  abstract leadsUltimosDias(dias: number): Promise<Lead[]>;
}
