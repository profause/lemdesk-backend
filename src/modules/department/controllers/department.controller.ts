import { Body, Controller, Get, Header, Logger, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable, map, switchMap, of } from 'rxjs';
import { AuthTokenGuard } from 'src/modules/shared/guards/auth-token.guard';
import { ApiResponse, ResponseCodes } from 'src/modules/shared/models/api-response';
import { UpdateResult } from 'typeorm';
import { Department } from '../models/department.entity';
import { DepartmentService } from '../services/department.service';

@Controller('department')
export class DepartmentController {
    private readonly logger = new Logger(DepartmentController.name);
    constructor(public departmentService: DepartmentService) {
    }

    @UseGuards(AuthTokenGuard)
    @Post('create')
    @Header('Cache-Control', 'none')
    create(@Body() department: Department): Observable<ApiResponse> {
        let response = new ApiResponse();
        const createdDepartmentResult$ = this.departmentService.create(department);
        return createdDepartmentResult$.pipe(map((createdDepartment: Department) => {
            response.code = ResponseCodes.SUCCESS.code;
            response.message = ResponseCodes.SUCCESS.message;
            response.data = { ...createdDepartment };
            return response;
        }));
    }

    @UseGuards(AuthTokenGuard)
    @Get('findall')
    @Header('Cache-Control', 'none')
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<ApiResponse> {
        let response = new ApiResponse();

        return this.departmentService.findAll({ page, limit }).pipe(map((departmentsPagable) => {
            const departmentItems = departmentsPagable.items;
            const departmentItemsMeta = departmentsPagable.meta;
            if (departmentItems.length > 0) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = departmentItems;
                response.meta = departmentItemsMeta;
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Get(':departmentId')
    @Header('Cache-Control', 'none')
    findOne(@Param('departmentId') departmentId: string): Observable<ApiResponse> {
        let response = new ApiResponse();
        return this.departmentService.findOne(departmentId).pipe(map((department) => {
            if (department.hasId) {
                response.code = ResponseCodes.SUCCESS.code;
                response.message = ResponseCodes.SUCCESS.message;
                response.data = department
            } else {
                response.code = ResponseCodes.NO_RECORD_FOUND.code;
                response.message = ResponseCodes.NO_RECORD_FOUND.message;
            }
            return response;
        }));
    }

    @Put(':departmentId')
    @Header('Cache-Control', 'none')
    update(@Param('departmentId') departmentId: string, @Body() department: Department): Observable<ApiResponse> {
        let response = new ApiResponse();
        department.id = departmentId;
        return this.departmentService.update(department).pipe(
            switchMap((department: UpdateResult) => {
                if (department.affected > 0) {
                    response.code = ResponseCodes.SUCCESS.code;
                    response.message = ResponseCodes.SUCCESS.message;

                    return this.departmentService.findOne(departmentId).pipe(map((department) => {
                        if (department.hasId) {
                            response.code = ResponseCodes.SUCCESS.code;
                            response.message = ResponseCodes.SUCCESS.message;
                            response.data = department
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
