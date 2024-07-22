import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private readonly userservice: UserService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user as User;
    const userId = encodeURIComponent(user.userId);
    const displayName = encodeURIComponent(user.displayName);
    // 클라이언트가 이해할 수 있는 URL로 리다이렉트
    res.redirect(
      `http://143.248.226.200:3000/?displayName=${displayName}&userId=${userId}`,
    );
    // res.redirect(`https://archidesk.loca.lt/?displayName=${displayName}`);
  }
}
