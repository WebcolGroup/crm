import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioRepositoryPort } from '../../../Ports/repositories/usuario.repository.port';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UsuarioRepositoryPort)
    private readonly usuarioRepo: UsuarioRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async ejecutar(dto: LoginDto): Promise<{ access_token: string; usuario: { id: string; nombre: string; rol: string } }> {
    const usuario = await this.usuarioRepo.buscarPorEmail(dto.email);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(dto.password, usuario.password_hash);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    };
  }
}
