import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { Reflector } from '@nestjs/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { AuditLog } from '../models/audit-log.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const auditLog = this.reflector.get<string>(
      'AUDIT_LOG_DATA',
      context.getHandler(),
    );
    this.logger.log(`[AUDIT LOG] ${auditLog}`);
    return next.handle().pipe(
      switchMap((data) => {
        const requestBody = JSON.stringify(request.body).includes('password')
          ? {}
          : request.body;

         //let tempData = data
          //delete tempData.data.token;

        const body = {
          body: requestBody,
          params: request.params,
          response: data,
        };
        let audit = new AuditLog();
        audit.auditLog = auditLog;
        audit.attributes = JSON.stringify(body);
        audit.ipAddress = request.ip;
        return this.auditLogService.create(audit).pipe(map(() => data));
      }),
    );
  }
}
