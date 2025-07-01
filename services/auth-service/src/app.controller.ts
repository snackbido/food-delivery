import { Controller, Logger } from '@nestjs/common';
import { AppService } from '@auth/app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDTO } from '@auth/dto/register.dto';
import { SignInDTO } from '@auth/dto/sigin.dto';
import { ForgotPasswordDTO } from '@auth/dto/forgot-password.dto';

@Controller()
export class AppController {
  private logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @MessagePattern('register')
  async register(@Payload() registerDto: RegisterDTO): Promise<string> {
    return await this.appService.register(registerDto);
  }

  @MessagePattern('login')
  async login(@Payload() signInDto: SignInDTO): Promise<any> {
    try {
      return await this.appService.login(signInDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('forgotPassword')
  async forgotPassword(
    @Payload() forgotPasswordDto: ForgotPasswordDTO,
  ): Promise<string> {
    try {
      return await this.appService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('resetPassword')
  async resetPassword(@Payload() data: any): Promise<string> {
    try {
      const { token, resetPassword } = data;
      return await this.appService.resetPassword(token, resetPassword);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('changedPassword')
  async changedPassword(@Payload() data: any): Promise<string> {
    try {
      const { user, changedPasswordDto } = data;
      return await this.appService.changedPassword(user, changedPasswordDto);
    } catch (error) {
      return error;
    }
  }
}
