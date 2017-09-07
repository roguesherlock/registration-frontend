class BaseCtrl {
    constructor(User) {
        'ngInject';
    }
}

export default {
    controller: BaseCtrl,
    templateUrl: 'components/registration/base.html',
    bindings: {
        centers: '=',
        events: '=',
        centerScopes: '='
    }
}