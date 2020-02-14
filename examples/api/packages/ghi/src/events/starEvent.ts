import { StarType } from '../types/star';

class StarEvent {
    data: StarType;

    constructor(payload: StarType) {
        this.data = payload;
    }
}

export { StarEvent };