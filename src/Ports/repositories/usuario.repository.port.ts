import { Usuario } from '../../Domain/Auth/entities/usuario.entity';

export abstract class UsuarioRepositoryPort {
  abstract buscarPorEmail(email: string): Promise<Usuario | null>;
  abstract crear(datos: Partial<Usuario>): Promise<Usuario>;
}
