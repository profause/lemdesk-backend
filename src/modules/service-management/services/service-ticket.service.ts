import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Observable, from } from 'rxjs';
import { Repository } from 'typeorm';
import { ServiceTicket } from '../models/service-ticket.entity';

@Injectable()
export class TicketService extends TypeOrmQueryService<ServiceTicket> {
    constructor(@InjectRepository(ServiceTicket) public readonly groupRepository: Repository<ServiceTicket>,
    ) {
        super(groupRepository, { useSoftDelete: true })
    }
    public create(group: ServiceTicket): Observable<ServiceTicket> {
        const createdServiceTicket = this.groupRepository.create(group);
        return from(this.groupRepository.save(createdServiceTicket));
    }
    public update = (group: ServiceTicket) => from(this.groupRepository.update(group.id, group));
    public findAll = (options: IPaginationOptions) => from(paginate<ServiceTicket>(this.groupRepository, options, {
    }));
    public findOne = (groupId: string) => from(this.groupRepository.findOne(groupId, {
    }));

    public findOne1(groupId: string) {
        const result = this.groupRepository.createQueryBuilder('group')
            .where({ id: groupId })
            .getOne()

        return from(result)
    }

    public delete = (groupId: string) => from(this.groupRepository.delete(groupId));

}