import { Interaccion, TipoInteraccion } from '../../Domain/Lead/entities/interaccion.entity';

export abstract class InteraccionRepositoryPort {
  abstract registrar(datos: {
    lead_id: string;
    tipo: TipoInteraccion;
    mensaje?: string;
  }): Promise<Interaccion>;

  abstract listarPorLead(lead_id: string): Promise<Interaccion[]>;
}
