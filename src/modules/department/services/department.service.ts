import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Observable, from } from 'rxjs';
import { Repository } from 'typeorm';
import { Department } from '../models/department.entity';

@Injectable()
export class DepartmentService  {
    constructor(@InjectRepository(Department) public readonly departmentRepository: Repository<Department>,
    ) {
        //super(departmentRepository, { useSoftDelete: true })
    }
    public create(department: Department): Observable<Department> {
        const createdDepartment = this.departmentRepository.create(department);
        return from(this.departmentRepository.save(createdDepartment));
    }
    public update = (department: Department) => from(this.departmentRepository.update(department.id, department));
    public findAll = (options: IPaginationOptions) => from(paginate<Department>(this.departmentRepository, options, {
        
    }));
    public findOne = (id: string) => from(this.departmentRepository.findOneBy({id}));

    public findOne1(departmentId: string) {
        const result = this.departmentRepository.createQueryBuilder('department')
            .where({ id: departmentId })
            .getOne()

        return from(result)
    }

    public delete = (departmentId: string) => from(this.departmentRepository.delete(departmentId));


}