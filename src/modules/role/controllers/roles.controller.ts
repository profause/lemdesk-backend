import { Body, Controller, Delete, Get, Header, Logger, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { map, Observable, of, switchMap } from 'rxjs';
import { ApiResponse, ResponseCodes } from 'src/modules/shared/models/api-response';
import { AccessLevels, SystemRoles } from 'src/modules/shared/models/roles.enum';
import { SharedService } from 'src/modules/shared/services/shared.service';
import { UpdateResult } from 'typeorm';
import { Role } from '../models/role.entity';
import { RoleService } from '../services/role/role.service';
import { AuditLog } from 'src/modules/audit-log/utils/audit-log.decorator';
import { AuditLogInterceptor } from 'src/modules/audit-log/interceptors/audit-log.interceptor';

@UseInterceptors(AuditLogInterceptor)
@Controller('role')
export class RolesController {
    private readonly logger = new Logger(RolesController.name);
    constructor(public roleService: RoleService,
        private sharedService: SharedService) {
    }

    @Post('create')
    @AuditLog('Create Role')
    @Header('Cache-Control', 'none')
    create(@Body() role: Role): Observable<ApiResponse> {
        let response = new ApiResponse();
        const createRoleResult$ = this.roleService.create(role);
        return createRoleResult$.pipe(map((createdRole: Role) => {
            response.code = ResponseCodes.SUCCESS.code;
            response.message = ResponseCodes.SUCCESS.message;
            response.data = { ...createdRole };
            return response;
        }));
    }

    @Put(':roleId')
    @AuditLog('Update Role')
    @Header('Cache-Control', 'none')
    update(@Param('roleId') roleId: string, @Body() role: Role): Observable<ApiResponse> {
        let response = new ApiResponse();
        role.id = roleId;
        return this.roleService.update(role).pipe(
            switchMap((role: UpdateResult) => {
                if (role.affected > 0) {
                    response.code = ResponseCodes.SUCCESS.code;
                    response.message = ResponseCodes.SUCCESS.message;

                    return this.roleService.findOne(roleId).pipe(map((role) => {
                        if (role.hasId) {
                            response.code = ResponseCodes.SUCCESS.code;
                            response.message = ResponseCodes.SUCCESS.message;
                            response.data = role
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

    @Get('findall')
    @AuditLog('Get Roles')
    @Header('Cache-Control', 'none')
    findAll(): Observable<ApiResponse> {
        let response = new ApiResponse();
        response.code = ResponseCodes.SUCCESS.code;
        response.message = ResponseCodes.SUCCESS.message;
        response.data = {
            roles: this.sharedService.enumToArray(SystemRoles),
            accesslevels: this.sharedService.enumToArray(AccessLevels)
        }

        return of(response);
        // return this.roleService.findAll({ page, limit }).pipe(map((rolesPagable) => {
        //     const roleItems = rolesPagable.items;
        //     const roleItemsMeta = rolesPagable.meta;
        //     if (roleItems.length > 0) {
        //         response.code = ResponseCodes.SUCCESS.code;
        //         response.message = ResponseCodes.SUCCESS.message;
        //         response.data = roleItems;
        //         response.meta = roleItemsMeta;
        //     } else {
        //         response.code = ResponseCodes.NO_RECORD_FOUND.code;
        //         response.message = ResponseCodes.NO_RECORD_FOUND.message;
        //     }
        //     return response;
        // }));
    }

    @Get(':roleId')
    @AuditLog('Get Role')
    @Header('Cache-Control', 'none')
    findOne(@Param('roleId') roleId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.roleService.findOne(roleId).pipe(map((role) => {
            if (role.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = role
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Delete(':roleId')
    @AuditLog('Delete Role')
    @Header('Cache-Control', 'none')
    delete(@Param('roleId') roleId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.roleService.delete(roleId).pipe(map((role) => {
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
