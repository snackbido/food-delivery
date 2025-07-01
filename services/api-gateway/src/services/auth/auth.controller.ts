import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@gateway/services/auth/auth.service';
import { LoginDTO } from '@gateway/services/auth/dto/login.dto';
import { RegisterDTO } from '@gateway/services/auth/dto/register.dto';
import { ForgotPasswordDTO } from '@gateway/services/auth/dto/forgot-password.dto';
import { ResetPasswordDTO } from '@gateway/services/auth/dto/reset-password.dto';
import { ChangedPasswordDTO } from '@gateway/services/auth/dto/changed-password.dto';
import { User } from '@gateway/services/auth/decorator/user.decorator';
import { JwtAuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDTO,
  ) {
    return await this.authService.resetPassword(token, resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changed-password')
  @HttpCode(HttpStatus.OK)
  async changedPassword(
    @User() user: any,
    @Body() changedPasswordDto: ChangedPasswordDTO,
  ) {
    return await this.authService.changedPassword(user, changedPasswordDto);
  }
}
