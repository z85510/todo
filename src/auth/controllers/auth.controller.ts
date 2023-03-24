import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser } from '../../shared/decorators/user.decorator';
import { Tokens } from '../../shared/utils/types';
import { AuthDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../strategies/local_auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @UsePipes(ValidationPipe)
  createUser(@Body() userInfo: AuthDto): Promise<Tokens> {
    return this.authService.signUp(userInfo);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Return  token',
  })
  @ApiBody({ type: AuthDto })
  @UsePipes(ValidationPipe)
  login(@Body() userInfo: AuthDto) {
    return this.authService.loginWithCredentials(userInfo);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Return  token',
  })
  refreshToken(@CurrentUser() user: any, @Body() refreshToken: string) {
    return this.authService.refreshToken(user.id, refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  logout(@CurrentUser() user: any) {
    return this.authService.logOut(user.id);
  }
}
