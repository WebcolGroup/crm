import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../Domain/Auth/entities/usuario.entity';
import { UsuarioRepositoryPort } from '../../../Ports/repositories/usuario.repository.port';

@Injectable()
export class UsuarioRepository implements UsuarioRepositoryPort {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { email } });
  }

  async crear(datos: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.repo.create(datos);
    return this.repo.save(usuario);
  }
}
