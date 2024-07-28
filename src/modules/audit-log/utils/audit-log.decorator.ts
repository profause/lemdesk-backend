import { SetMetadata } from "@nestjs/common";

const AUDIT_LOG_DATA = 'AUDIT_LOG_DATA';
const AUDIT_LOG_OPTIONS = 'AUDIT_LOG_OPTIONS';
interface AuditLogOptions {
    auditLogData: string;
    saveRespnse:boolean;
}
export const AuditLog = (value: string) => SetMetadata(AUDIT_LOG_DATA, value);
export const AuditLog2 = (value: AuditLogOptions) => SetMetadata(AUDIT_LOG_OPTIONS, value);