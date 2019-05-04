class listCtrl {
    constructor($uibModal, $state) {
        'ngInject';
        var vm = this;
        vm.showList = [false, false];
        vm.showImage = true;
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
        vm.enable = function (index) {
            vm.showImage = !vm.showImage;
            vm.showList[index] = true;
            vm.showList[index ^ 1] = false;
            console.log(vm.showList);
        }
        vm.enableImage = function () {
            vm.showImage = !vm.showImage;
            console.log(vm.showImage);
        }
        vm.goRegister = function (val) {
            $state.go('base.register', { val: val })
        }
        vm.disable = function (index) {
            vm.showList[index] = false;
        }
    }
}
export default {
    controller: listCtrl,
    templateUrl: 'components/registration/listPage.html',
    require: {
        baseCtrl: '^baseLayout',
    }
}