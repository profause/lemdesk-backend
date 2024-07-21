import { Body, Controller, Delete, Get, Header, Logger, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable, map, switchMap, of } from 'rxjs';
import { AuthTokenGuard } from 'src/modules/shared/guards/auth-token.guard';
import { ApiResponse, ResponseCodes } from 'src/modules/shared/models/api-response';
import { UpdateResult } from 'typeorm';
import { Feedback } from '../models/feedback.entity';
import { FeedbackService } from '../services/feedback.service';
import { AuditLog } from 'src/modules/audit-log/utils/audit-log.decorator';
import { AuditLogInterceptor } from 'src/modules/audit-log/interceptors/audit-log.interceptor';

@UseInterceptors(AuditLogInterceptor)
@Controller('feedbacks')
export class FeedbackController {
    private readonly logger = new Logger(FeedbackController.name);
    constructor(public feedbackService: FeedbackService) {
    }

    @UseGuards(AuthTokenGuard)
    @AuditLog('Create Feedback')
    @Post('')
    @Header('Cache-Control', 'none')
    create(@Body() feedback: Feedback): Observable<ApiResponse> {
        let response = new ApiResponse();
        const createdFeedbackResult$ = this.feedbackService.create(feedback);
        return createdFeedbackResult$.pipe(map((createdFeedback: Feedback) => {
            response.code = ResponseCodes.SUCCESS.code;
            response.message = ResponseCodes.SUCCESS.message;
            response.data = { ...createdFeedback };
            return response;
        }));
    }

    @UseGuards(AuthTokenGuard)
    @Get('')
    @AuditLog('Get Feedbacks')
    @Header('Cache-Control', 'none')
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<ApiResponse> {
        let response = new ApiResponse();

        return this.feedbackService.findAll({ page, limit }).pipe(map((feedbacksPagable) => {
            const feedbackItems = feedbacksPagable.items;
            const feedbackItemsMeta = feedbacksPagable.meta;
            if (feedbackItems.length > 0) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = feedbackItems;
                response.meta = feedbackItemsMeta;
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Get(':feedbackId')
    @AuditLog('Get Feedback')
    @Header('Cache-Control', 'none')
    findOne(@Param('feedbackId') feedbackId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.feedbackService.findOne(feedbackId).pipe(map((feedback) => {
            if (feedback.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = feedback
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Put(':feedbackId')
    @AuditLog('Update Feedback')
    @Header('Cache-Control', 'none')
    update(@Param('feedbackId') feedbackId: string, @Body() feedback: Feedback): Observable<ApiResponse> {
        let response = new ApiResponse();
        feedback.id = feedbackId;
        return this.feedbackService.update(feedback).pipe(
            switchMap((feedback: UpdateResult) => {
                if (feedback.affected > 0) {
                    response.code = ResponseCodes.SUCCESS.code;
                    response.message = ResponseCodes.SUCCESS.message;

                    return this.feedbackService.findOne(feedbackId).pipe(map((feedback) => {
                        if (feedback.hasId) {
                            response.code = ResponseCodes.SUCCESS.code;
                            response.message = ResponseCodes.SUCCESS.message;
                            response.data = feedback
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

    @Delete(':feedbackId')
    @AuditLog('Delete Feedback')
    @Header('Cache-Control', 'none')
    delete(@Param('feedbackId') feedbackId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.feedbackService.delete(feedbackId).pipe(map((role) => {
            if (role.affected > 0) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }
}
