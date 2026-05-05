import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../../../Application/Auth/use-cases/login.use-case';
import { LoginDto } from '../../../Application/Auth/dtos/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  /**
   * POST /auth/login
   * Retorna un JWT Bearer token para autenticar el resto de endpoints.
   *
   * Body: { email: "admin@webcol.co", password: "mi_password" }
   */
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  iniciarSesion(@Body() dto: LoginDto) {
    return this.login.ejecutar(dto);
  }
}
