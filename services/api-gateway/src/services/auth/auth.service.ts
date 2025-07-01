import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDTO } from '@gateway/services/auth/dto/login.dto';
import { firstValueFrom } from 'rxjs';
import { RegisterDTO } from '@gateway/services/auth/dto/register.dto';
import { ForgotPasswordDTO } from '@gateway/services/auth/dto/forgot-password.dto';
import { ResetPasswordDTO } from '@gateway/services/auth/dto/reset-password.dto';
import { ChangedPasswordDTO } from '@gateway/services/auth/dto/changed-password.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private clientProxy: ClientProxy) {}
  async register(registerDto: RegisterDTO) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send('register', registerDto),
      );

      if (response.error) {
        throw new BadGatewayException(response.error);
      }

      return response;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async login(loginDto: LoginDTO): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send('login', loginDto),
      );

      if (response.error) {
        throw new BadGatewayException(response.error);
      }

      return response;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDTO) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send('forgotPassword', forgotPasswordDto),
      );

      if (response.error) {
        throw new BadGatewayException(response.error);
      }
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async resetPassword(token: string, resetPassword: ResetPasswordDTO) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send('resetPassword', { token, resetPassword }),
      );

      if (response.error) {
        throw new BadGatewayException(response.error);
      }
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async changedPassword(user: any, changedPasswordDto: ChangedPasswordDTO) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send('changedPassword', { user, changedPasswordDto }),
      );

      if (response.error) {
        throw new BadGatewayException(response.error);
      }

      return response;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
