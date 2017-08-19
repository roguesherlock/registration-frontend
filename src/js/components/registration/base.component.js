class BaseCtrl {
    constructor() {
        'ngInject';
    }
}

export default {
    controller: BaseCtrl,
    templateUrl: 'components/registration/base.html',
    bindings: {
        centers: '=',
        events: '='
    }
}