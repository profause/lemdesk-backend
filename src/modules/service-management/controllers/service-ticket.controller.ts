import { Body, Controller, Get, Header, Logger, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable, map, switchMap, of } from 'rxjs';
import { AuthTokenGuard } from 'src/modules/shared/guards/auth-token.guard';
import { ApiResponse, ResponseCodes } from 'src/modules/shared/models/api-response';
import { UpdateResult } from 'typeorm';
import { ServiceTicket } from '../models/service-ticket.entity';
import { TicketService } from '../services/service-ticket.service';

@Controller('serviceTicket')
export class ServiceTicketController {
    private readonly logger = new Logger(ServiceTicketController.name);
    constructor(public ticketService: TicketService,) {
    }

    @UseGuards(AuthTokenGuard)
    @Post('create')
    @Header('Cache-Control', 'none')
    create(@Body() serviceTicket: ServiceTicket): Observable<ApiResponse> {
        let response = new ApiResponse();
        const createdServiceTicketResult$ = this.ticketService.create(serviceTicket);
        return createdServiceTicketResult$.pipe(map((createdServiceTicket: ServiceTicket) => {
            response.code = ResponseCodes.SUCCESS.code;
            response.message = ResponseCodes.SUCCESS.message;
            response.data = { ...createdServiceTicket };
            return response;
        }));
    }

    @UseGuards(AuthTokenGuard)
    @Get('findall')
    @Header('Cache-Control', 'none')
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<ApiResponse> {
        let response = new ApiResponse();

        return this.ticketService.findAll({ page, limit }).pipe(map((serviceTicketsPagable) => {
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
        }));
    }

    @Get(':serviceTicketId')
    @Header('Cache-Control', 'none')
    findOne(@Param('serviceTicketId') serviceTicketId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.ticketService.findOne(serviceTicketId).pipe(map((serviceTicket) => {
            if (serviceTicket.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = serviceTicket
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Put(':serviceTicketId')
    @Header('Cache-Control', 'none')
    update(@Param('serviceTicketId') serviceTicketId: string, @Body() serviceTicket: ServiceTicket): Observable<ApiResponse> {
        let response = new ApiResponse();
        serviceTicket.id = serviceTicketId;
        return this.ticketService.update(serviceTicket).pipe(
            switchMap((serviceTicket: UpdateResult) => {
                if (serviceTicket.affected > 0) {
                    response.code = ResponseCodes.SUCCESS.code;
                    response.message = ResponseCodes.SUCCESS.message;

                    return this.ticketService.findOne(serviceTicketId).pipe(map((serviceTicket) => {
                        if (serviceTicket.hasId) {
                            response.code = ResponseCodes.SUCCESS.code;
                            response.message = ResponseCodes.SUCCESS.message;
                            response.data = serviceTicket
                        } else {
                            response.code = ResponseCodes.NO_RECORD_FOUND.code;
                            response.message = ResponseCodes.NO_RECORD_FOUND.message;
                        }
                        return response;
                    }));

                } else {
                    response.code = ResponseCodes.FAILED.code;
                    response.message = ResponseCodes.FAILED.message;
                }
            }),
        )
    }

}
