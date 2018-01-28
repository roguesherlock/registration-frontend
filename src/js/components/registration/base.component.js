class BaseCtrl {
    constructor(User) {
        'ngInject';
        let vm = this;

        vm.$onInit = function() {
            
        }

        vm.logout = function() {
            User.logout();
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