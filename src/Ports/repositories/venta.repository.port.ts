import { Venta } from '../../Domain/Lead/entities/venta.entity';
import { EstadoVenta } from '../../Domain/Lead/entities/venta.entity';

export abstract class VentaRepositoryPort {
  abstract registrar(datos: {
    lead_id: string;
    valor: number;
    estado?: EstadoVenta;
    notas?: string;
  }): Promise<Venta>;

  abstract actualizarEstado(id: string, estado: EstadoVenta): Promise<void>;
  abstract listarPorLead(lead_id: string): Promise<Venta[]>;
  abstract valorTotalCerrado(): Promise<number>;
}
