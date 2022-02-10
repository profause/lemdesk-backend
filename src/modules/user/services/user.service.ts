import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class UserService extends TypeOrmQueryService<User> {
    constructor(@InjectRepository(User) public readonly userRepository: Repository<User>,
        public authService: AuthService
    ) {
        super(userRepository, { useSoftDelete: true })
    }
    public create(user: User): Observable<User> {
        const createdUser = this.userRepository.create(user);
        return from(this.userRepository.save(createdUser));
    }
    public update = (user: User) => from(this.userRepository.update(user.id, user));
    public findAll = (options: IPaginationOptions) => from(paginate<User>(this.userRepository, options));
    public findOne = (userId: string) => from(this.userRepository.findOne(userId));
    public delete = (userId: string) => from(this.userRepository.delete(userId));
}
