import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // Passport의 특징: 각 인증 방법을 "전략"이라는 독립적인 모듈로 제공을 한다. 필요한 인증 방법을 간다히 추가하고 교체 가능, 미들웨어 구조임
// 전략이란 Passport에서 특정 인증 방식을 구현하는 모듈임
// 미들웨어란 다양한 기능을 수행하는 중간 계층 소프트웨어임, 인증을 처리하기 위한 미들웨어는 사용자가 요청을 보낼 때 요청을 가로채고, 인증 절차를 수행하여 사용자가 적절한 권한을 갖는지 확인
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../user.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable() //의존성 주입을 가능하게 하는 태그임
// 다른 A 클래스의 생성자의 매개변수로 이 GoogleStrategy 클래스의 객체를 전달하여 의존성을 주입 그러면 A 클래스에서 GoogleStrategy 클래스의 함수를 사용할 수가 있다
// 또는 setter를 통한 setGoogleStrategy(googleStrategy: GoogleStrategy) {this.googleStrategy = googleStrategy} 이런 set method를 다른 클래스 A에 적어줌으로 써 A에서 GoogleStrategy의 함수 사용이 가능
// 의존성 주입을 하기 위해서는 다른 클래스 A의 모듈에서 GoogleStrategy가 속한 모듈을 import 해줘야 된다.
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    // 생성자의 매개변수로 UserService의 클래스 객체를 전달함으로써 UserService의 의존정을 주입하고 있는 것임
    super({
      // PassportStrategy 클래스의 생성자를 호출하여 Google OAuth2 전략을 설정
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'], // 요청할 프로필 범위
    });
  }

  // 콜백 함수: 특정 작업이 완료된 후 호출된 후 호출되는 함수임, 다른 함수의 인자로 사용되는 함수이기도 함
  // Promise는 비동기 작업을 처리하기 위한 객체임
  //(param1, param2, ..., paramN) => { statements }
  //param1, param2, ..., paramN: 함수의 매개변수입니다. statements: 함수가 실행할 코드 블록입니다.
  // 인증된 사용자의 프로필 정보를 기반으로 애플리케이션의 사용자 정보를 조회하거나 생성하는 것임
  // async: 비동기 함수, await 함수를 사용해서 Promise를 기다림
  // done: VerifyCallback Passport가 제공하는 검증 콜백 함수임, 검증이 완료되었을 때 호출되어 결과를 Passport에 전딜함
  // Promise<any>: 비동기 함수는 항상 Promise를 반환한다. 함수의 결과를 Promise 감싸서 반환하는 형태이다.
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    let user = await this.userService.findOneByGoogleId(id);
    if (!user) {
      user = await this.userService.create({
        googleId: id,
        userId: emails[0].value,
        displayName,
      });
    }
    done(null, user);
  }
}
