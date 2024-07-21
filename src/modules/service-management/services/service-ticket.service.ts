import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from 'src/modules/user/models/user.entity';
import { Repository } from 'typeorm';
import { ServiceTicketComment } from '../models/service-ticket-comment.entity';
import { ServiceTicket } from '../models/service-ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(ServiceTicket)
    public readonly ServiceTicketRepository: Repository<ServiceTicket>,
    @InjectRepository(ServiceTicketComment)
    public readonly ServiceTicketCommentRepository: Repository<ServiceTicketComment>,
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
  ) {
    //super(ServiceTicketRepository, { useSoftDelete: true });
  }
  public create(ServiceTicket: ServiceTicket): Observable<ServiceTicket> {
    //random assigned_to_id
    //get all user id that belong to this department
    const departmentName = ServiceTicket.assignedToDepartment;

    const userIds = this.userRepository.find({
      where: {
        department: departmentName,
      },
      select: ['id'],
    });

    return from(userIds).pipe(
      map((r) => {
        return r.map((t) => {
          return t.id;
        });
      }),
      switchMap((ee) => {
        let index = Math.floor(Math.random() * ee.length);
        const id = ee[index];
        console.log('[]:', ee);
        console.log('ran', id);
        ServiceTicket.assignedToId = id;
        const createdServiceTicket =
          this.ServiceTicketRepository.create(ServiceTicket);
        return from(this.ServiceTicketRepository.save(createdServiceTicket));
      }),
    );
  }
  public update = (ServiceTicket: ServiceTicket) =>
    from(this.ServiceTicketRepository.update(ServiceTicket.id, ServiceTicket));
  public findAll = (options: IPaginationOptions) =>
    from(paginate<ServiceTicket>(this.ServiceTicketRepository, options, {}));

  public findAllInitiatedBy(userId: string, options: IPaginationOptions) {
    return from(
      paginate<ServiceTicket>(this.ServiceTicketRepository, options, {
        where: {
          initiatorId: userId,
        },
      }),
    );
  }
  public findAllAssignedTo = (userId: string, options: IPaginationOptions) =>
    from(
      paginate<ServiceTicket>(this.ServiceTicketRepository, options, {
        where: {
          assignedToId: userId,
        },
      }),
    );

  public findAllByStatus = (
    userId: string,
    status: string,
    options: IPaginationOptions,
  ) =>
    from(
      paginate<ServiceTicket>(this.ServiceTicketRepository, options, {
        where: {
          assignedToId: userId,
          status: status,
        },
      }),
    );

  public findOne = (id: string) =>
    from(this.ServiceTicketRepository.findOneBy({ id }));

  public findOne1(ServiceTicketId: string) {
    const result = this.ServiceTicketRepository.createQueryBuilder(
      'ServiceTicket',
    )
      .where({ id: ServiceTicketId })
      .getOne();

    return from(result);
  }

  public delete = (ServiceTicketId: string) =>
    from(this.ServiceTicketRepository.delete(ServiceTicketId));

  public createComment(
    serviceTicketComment: ServiceTicketComment,
  ): Observable<ServiceTicketComment> {
    const createdServiceTicketComment =
      this.ServiceTicketCommentRepository.create(serviceTicketComment);
    return from(
      this.ServiceTicketCommentRepository.save(createdServiceTicketComment),
    );
  }

  public findAllServiceTicketComments = (
    serviceTicketId: string,
    options: IPaginationOptions,
  ) =>
    from(
      paginate<ServiceTicketComment>(
        this.ServiceTicketCommentRepository,
        options,
        {
          where: {
            serviceTicketId: serviceTicketId,
          },
          order: {
            createdDate: 'ASC',
          },
        },
      ),
    );

  public deleteComment = (serviceTicketCommentId: string) =>
    from(this.ServiceTicketCommentRepository.delete(serviceTicketCommentId));

  public updateComment = (serviceTicketComment: ServiceTicketComment) =>
    from(
      this.ServiceTicketCommentRepository.update(
        serviceTicketComment.id,
        serviceTicketComment,
      ),
    );
  public findOneComment = (id: string) =>
    from(this.ServiceTicketCommentRepository.findOneBy({ id }));

  public findStats(status: string) {
    let stats = {};
    //return from(this.ServiceTicketRepository.find());
    const pending = this.ServiceTicketRepository.countBy({
      status: 'PENDING',
    })

    const open = this.ServiceTicketRepository.countBy({
      status: 'OPEN',
    })

    const resolved = this.ServiceTicketRepository.countBy({
      status: 'RESOLVED',
    })

    const closed = this.ServiceTicketRepository.countBy({
      status: 'CLOSED',
    })

    return from(Promise.all([pending, open, resolved, closed]));
    
  }
}
