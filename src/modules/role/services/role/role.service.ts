import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions,paginate } from 'nestjs-typeorm-paginate';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Role } from '../../models/role.entity';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) public readonly roleRepository: Repository<Role>
    ) {
       //super(roleRepository, { useSoftDelete: true })
    }

    public create(role: Role): Observable<Role> {
        const r = this.roleRepository.create(role);
        return from(this.roleRepository.save(r));
    }
    public update = (role: Role) => from(this.roleRepository.update(role.id, role));
    public findAll = (options: IPaginationOptions) => from(paginate<Role>(this.roleRepository, options));
    public findOne = (id: string) => from(this.roleRepository.findOneBy({id}));
    public delete = (roleId: string) => from(this.roleRepository.delete(roleId));
}
