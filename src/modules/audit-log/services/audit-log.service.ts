import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditLog } from "../models/audit-log.entity";
import { Repository } from "typeorm";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { Observable, from } from "rxjs";

@Injectable()
export class AuditLogService {
    constructor(@InjectRepository(AuditLog) public readonly auditLogRepository: Repository<AuditLog>,
    ) {
    }

    public findAll = (options: IPaginationOptions) => from(paginate<AuditLog>(this.auditLogRepository, options, {
        order: { createdDate: 'DESC' }
    }));

    public create(auditLog: AuditLog): Observable<AuditLog> {
        const createdAuditLog = this.auditLogRepository.create(auditLog);
        return from(this.auditLogRepository.save(createdAuditLog));
    }
}