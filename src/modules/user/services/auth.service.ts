import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  private userId: string;

  getUserId(): string {
    return this.userId || '';
  }

  setUserId(id: string) {
    this.userId = id;
  }

  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
    public readonly jwtService: JwtService,
  ) {}

  public loginWithUsernameAndPassword(
    username: string,
    password: string,
  ): Observable<any> {
    return from(this.userRepository.findOneBy({ username })).pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        return this.comparePasswords(password, user.password).pipe(
          switchMap((isValid) => {
            if (!isValid) {
              return of(false);
            }
            const jwtUser = {
              username: user.username,
              email: user.email,
              id: user.id,
              role: user.role,
              fullname: user.fullname,
            };
            return this.generateAccessToken(jwtUser).pipe(
              switchMap((token) => {
                jwtUser['token'] = token;
                return of(jwtUser);
              }),
            );
          }),
        );
      }),
    );
  }

  public hashPassword(password: string): Observable<string> {
    bcrypt.hash(password, 10, function (err, hash) {
      return of(hash);
    });

    return;
  }

  public comparePasswords(
    newPassword: string,
    hashedPassword: string,
  ): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compareSync(newPassword, hashedPassword));
  }

  public generateAccessToken(data: any): Observable<string> {
    return from(
      this.jwtService.signAsync({
        data,
      }),
    );
  }

  public refreshToken(userId: string): Observable<any> {
    return from(this.userRepository.findOneBy({ id: userId })).pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        const jwtUser = {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.role,
          fullname: user.fullname,
        };
        return this.generateAccessToken(jwtUser);
      }),
    );
  }
}
