import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** POST /v1/auth/login — public, no auth required */
  @Post('auth/login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  /** GET /v1/auth/tenants — public, lists demo tenant accounts */
  @Get('auth/tenants')
  getDemoTenants() {
    return this.userService.getDemoTenants();
  }

  /** GET /v1/users/profile — authenticated */
  @Get('users/profile')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() userId: string) {
    return this.userService.getProfile(userId);
  }
}
