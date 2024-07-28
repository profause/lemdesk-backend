import { Injectable } from "@nestjs/common";
import { Connection, EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import { Department } from "../models/department.entity";

@Injectable()
@EventSubscriber()
export class DepartmentSubscriber implements EntitySubscriberInterface<Department> {
    listenTo() {
        return Department;
    }

    constructor() {
    }

    afterLoad(department: Department, event?: LoadEvent<Department>): void | Promise<any> {
    }
}