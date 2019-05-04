class SC {
    constructor($uibModal) {
        'ngInject';
        var vm = this;
        vm.showList = [false, false];
        // vm.events = vm.baseCtrl.events;
        vm.$onInit = function () {
            vm.events = vm.baseCtrl.events;
        }
        vm.formatDate = function (date) {
            return moment(date).format("Do MMM YYYY")
        }
        vm.ok = function () {
            vm.dismiss({ $value: 'cancel' });
        };
        vm.formatGender = function (gender) {
            if (gender === 'male') {
                return 'Boys';
            } else if (gender === 'female') {
                return 'Girls';
            } else {
                return 'Boys & Girls';
            }
        }
    }
}
export default {
    controller: SC,
    templateUrl: 'components/registration/sc.html',
    require: {
        baseCtrl: '^baseLayout',
    }
}