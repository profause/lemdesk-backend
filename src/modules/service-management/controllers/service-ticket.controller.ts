import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map, switchMap, of } from 'rxjs';
import { AuthTokenGuard } from 'src/modules/shared/guards/auth-token.guard';
import {
  ApiResponse,
  ResponseCodes,
} from 'src/modules/shared/models/api-response';
import { UpdateResult } from 'typeorm';
import { ServiceTicketComment } from '../models/service-ticket-comment.entity';
import { ServiceTicket } from '../models/service-ticket.entity';
import { TicketService } from '../services/service-ticket.service';
import { AuditLog } from 'src/modules/audit-log/utils/audit-log.decorator';
import { AuditLogInterceptor } from 'src/modules/audit-log/interceptors/audit-log.interceptor';

@UseInterceptors(AuditLogInterceptor)
@Controller('service-tickets')
export class ServiceTicketController {
  private readonly logger = new Logger(ServiceTicketController.name);
  constructor(public ticketService: TicketService) {}

  @UseGuards(AuthTokenGuard)
  @Post('')
  @AuditLog('Create Service Ticket')
  @Header('Cache-Control', 'none')
  create(@Body() serviceTicket: ServiceTicket): Observable<ApiResponse> {
    let response = new ApiResponse();
    const createdServiceTicketResult$ =
      this.ticketService.create(serviceTicket);
    return createdServiceTicketResult$.pipe(
      map((createdServiceTicket: ServiceTicket) => {
        response.code = ResponseCodes.SUCCESS.code;
        response.message = ResponseCodes.SUCCESS.message;
        response.data = { ...createdServiceTicket };
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('')
  @AuditLog('Get Service Tickets')
  @Header('Cache-Control', 'none')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAll({ page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('pending/:userId')
  @AuditLog('Get pending Service Tickets')
  @Header('Cache-Control', 'none')
  findPending(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllByStatusByUserId(userId,'PENDING',{ page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('assignedto/:userId')
  @AuditLog('Get assigned Service Tickets')
  @Header('Cache-Control', 'none')
  findAssigned(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllAssignedTo(userId,{ page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('initiatedby/:userId')
  @AuditLog('Get initiated Service Tickets')
  @Header('Cache-Control', 'none')
  findInitiated(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllInitiatedBy(userId, { page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('recently-closed/:userId')
  @AuditLog('Get recently closed Service Tickets')
  @Header('Cache-Control', 'none')
  findRecentlyClosedByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllByStatusByUserId(userId,'CLOSED',{ page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  @Get('recently-closed')
  @AuditLog('Get recently closed Service Tickets')
  @Header('Cache-Control', 'none')
  findRecentlyClosed(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllByStatus('CLOSED',{ page, limit }).pipe(
      map((serviceTicketsPagable) => {
        const serviceTicketItems = serviceTicketsPagable.items;
        const serviceTicketItemsMeta = serviceTicketsPagable.meta;
        if (serviceTicketItems.length > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicketItems;
          response.meta = serviceTicketItemsMeta;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  @Get(':serviceTicketId')
  @AuditLog('Get Service Ticket')
  @Header('Cache-Control', 'none')
  findOne(
    @Param('serviceTicketId') serviceTicketId: string,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    return this.ticketService.findOne(serviceTicketId).pipe(
      map((serviceTicket) => {
        if (serviceTicket.hasId) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
          response.data = serviceTicket;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  @Put(':serviceTicketId')
  @AuditLog('Update Service Ticket')
  @Header('Cache-Control', 'none')
  update(
    @Param('serviceTicketId') serviceTicketId: string,
    @Body() serviceTicket: ServiceTicket,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    serviceTicket.id = serviceTicketId;
    return this.ticketService.update(serviceTicket).pipe(
      switchMap((serviceTicket: UpdateResult) => {
        if (serviceTicket.affected > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;

          return this.ticketService.findOne(serviceTicketId).pipe(
            map((serviceTicket) => {
              if (serviceTicket.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = serviceTicket;
              } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
              }
              return response;
            }),
          );
        } else {
          response.code = ResponseCodes.FAILED.code;
          response.message = ResponseCodes.FAILED.message;
        }
      }),
    );
  }

  @Delete(':serviceTicketId')
  @AuditLog('Delete Service Ticket')
  @Header('Cache-Control', 'none')
  delete(
    @Param('serviceTicketId') serviceTicketId: string,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    return this.ticketService.delete(serviceTicketId).pipe(
      map((ticket) => {
        if (ticket.affected > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  //comments
  @UseGuards(AuthTokenGuard)
  @Post('comments')
  @AuditLog('Create Service Ticket Comment')
  @Header('Cache-Control', 'none')
  createComment(
    @Body() serviceTicketComment: ServiceTicketComment,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    const createdServiceTicketCommentResult$ =
      this.ticketService.createComment(serviceTicketComment);
    return createdServiceTicketCommentResult$.pipe(
      map((serviceTicketComment: ServiceTicketComment) => {
        response.code = ResponseCodes.SUCCESS.code;
        response.message = ResponseCodes.SUCCESS.message;
        response.data = { ...serviceTicketComment };
        return response;
      }),
    );
  }

  //@UseGuards(AuthTokenGuard)
  @Get('comments/:serviceTicketId')
  @AuditLog('Get Service Ticket Comments')
  @Header('Cache-Control', 'none')
  findAllComment(
    @Param('serviceTicketId') serviceTicketId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService
      .findAllServiceTicketComments(serviceTicketId, { page, limit })
      .pipe(
        map((serviceTicketCommentsPagable) => {
          const serviceTicketCommentItems = serviceTicketCommentsPagable.items;
          const serviceTicketCommentItemsMeta =
            serviceTicketCommentsPagable.meta;
          if (serviceTicketCommentItems.length > 0) {
            response.code = ResponseCodes.SUCCESS.code;
            response.message = ResponseCodes.SUCCESS.message;
            response.data = serviceTicketCommentItems;
            response.meta = serviceTicketCommentItemsMeta;
          } else {
            response.code = ResponseCodes.NO_RECORD_FOUND.code;
            response.message = ResponseCodes.NO_RECORD_FOUND.message;
          }
          return response;
        }),
      );
  }

  @Delete('comments/:serviceTicketCommentId')
  @AuditLog('Delete Service Ticket Comment')
  @Header('Cache-Control', 'none')
  deleteComment(
    @Param('serviceTicketCommentId') serviceTicketCommentId: string,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    return this.ticketService.deleteComment(serviceTicketCommentId).pipe(
      map((comment) => {
        if (comment.affected > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;
        } else {
          response.code = ResponseCodes.NO_RECORD_FOUND.code;
          response.message = ResponseCodes.NO_RECORD_FOUND.message;
        }
        return response;
      }),
    );
  }

  @Put('comments/:serviceTicketCommentId')
  @AuditLog('Update Service Ticket Comment')
  @Header('Cache-Control', 'none')
  updateComment(
    @Param('serviceTicketCommentId') serviceTicketCommentId: string,
    @Body() serviceTicketComment: ServiceTicketComment,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();
    serviceTicketComment.id = serviceTicketCommentId;
    return this.ticketService.updateComment(serviceTicketComment).pipe(
      switchMap((serviceTicketComment: UpdateResult) => {
        if (serviceTicketComment.affected > 0) {
          response.code = ResponseCodes.SUCCESS.code;
          response.message = ResponseCodes.SUCCESS.message;

          return this.ticketService.findOneComment(serviceTicketCommentId).pipe(
            map((serviceTicketComment) => {
              if (serviceTicketComment.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = serviceTicketComment;
              } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
              }
              return response;
            }),
          );
        } else {
          response.code = ResponseCodes.FAILED.code;
          response.message = ResponseCodes.FAILED.message;
        }
      }),
    );
  }

   //@UseGuards(AuthTokenGuard)
   @Get('stats/:status')
   @AuditLog('Get Service Ticket Stats')
   @Header('Cache-Control', 'none')
   stats(
    @Param('status') status: string,
   ): Observable<ApiResponse> {
     let response = new ApiResponse();
 
     return this.ticketService.findStats(status).pipe(
       map((values) => {
       const stats = {
          pending: values[0],
          open: values[1],
          resolved: values[2],
          closed: values[3],
        }
           response.code = ResponseCodes.SUCCESS.code;
           response.message = ResponseCodes.SUCCESS.message;
           response.data = stats;
         return response;
       }),
     );
   }
}
