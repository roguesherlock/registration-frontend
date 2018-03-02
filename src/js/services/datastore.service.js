export default class DataStore {
    constructor() {
        'ngInject';
        this.data = {};
    }

    add(key, data) {
        this.data[key] = data;
    }

    get(key, data) {
        return this.data[key];
    }

    append(key, data) {
        let tempData = this.data[key];
        this.data[key] = _.compact(_.concat(tempData, data));
    }

    clear(key) {
        this.data[key] = [];
    }
}