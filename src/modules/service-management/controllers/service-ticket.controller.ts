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

@Controller('service-tickets')
export class ServiceTicketController {
  private readonly logger = new Logger(ServiceTicketController.name);
  constructor(public ticketService: TicketService) {}

  @UseGuards(AuthTokenGuard)
  @Post('')
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
  @Header('Cache-Control', 'none')
  findPending(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllByStatus(userId,'PENDING',{ page, limit }).pipe(
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
  @Header('Cache-Control', 'none')
  findRecentlyClosed(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<ApiResponse> {
    let response = new ApiResponse();

    return this.ticketService.findAllByStatus(userId,'CLOSED',{ page, limit }).pipe(
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
}
