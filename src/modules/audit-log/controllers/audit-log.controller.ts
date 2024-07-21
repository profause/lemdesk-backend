import { Controller, Get, Header, Logger, Query, UseGuards } from "@nestjs/common";
import { AuditLogService } from "../services/audit-log.service";
import { ApiResponse, ResponseCodes } from "src/modules/shared/models/api-response";
import { Observable, map } from "rxjs";
import { AuthTokenGuard } from "src/modules/shared/guards/auth-token.guard";

@Controller('audit-logs')
export class AuditLogController {
    private readonly logger = new Logger(AuditLogController.name);
    constructor(public auditLogService: AuditLogService) {
    }

    @UseGuards(AuthTokenGuard)
    @Get('')
    @Header('Cache-Control', 'none')
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Observable<ApiResponse> {
        let response = new ApiResponse();

        return this.auditLogService.findAll({ page, limit }).pipe(map((auditLogsPagable) => {
            const auditLogItems = auditLogsPagable.items.map((item)=>{
                return {
                    ...item,
                    attributes:JSON.parse(item.attributes)
                }
            });
            const auditLogItemsMeta = auditLogsPagable.meta;
            if (auditLogItems.length > 0) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = auditLogItems;
                response.meta = auditLogItemsMeta;
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }
}