class BaseCtrl {
    constructor(User) {
        'ngInject';
        let vm = this;
        
        vm.$onInit = function() {
            vm.user_id = User.current.id;
        }
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