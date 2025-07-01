import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@gateway/services/user/user.service';
import { CreateUserDTO } from '@gateway/services/user/dto/create-user.dto';
import { UpdateUserDTO } from '@gateway/services/user/dto/update-user.dto';
import { JwtAuthGuard } from '@gateway/services/auth/guard/auth.guard';
import { RolesGuard } from '@gateway/services/auth/guard/role.guard';
import { Roles } from '@gateway/services/auth/decorator/role.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['customer'])
  @HttpCode(HttpStatus.OK)
  async findUserById(@Param('id') id: string): Promise<any> {
    return await this.userService.findUserById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<any> {
    return await this.userService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDTO): Promise<any> {
    return await this.userService.create(createUserDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<any> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<any> {
    return await this.userService.delete(id);
  }

  @Get('pickup-driver/random')
  @HttpCode(HttpStatus.OK)
  async pickupDriver(): Promise<any> {
    return await this.userService.pickupDriver();
  }
}
