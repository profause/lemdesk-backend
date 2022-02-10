import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {

    constructor(
    ) {
    }

    public StringIsNumber = value => isNaN(Number(value)) === false;

    // Turn enum into array
    public enumToArray(enumme) {
        return Object.keys(enumme)
            .filter(this.StringIsNumber)
            .map(key => enumme[key]);
    }

}
