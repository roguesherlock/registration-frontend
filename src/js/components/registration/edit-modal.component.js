class RowEditCtrl {
    constructor($uibModal) {
        'ngInject';
        var vm = this;
        vm.formatDate = function(date) {
            return moment(date).format("Do MMM YYYY")
        }
        vm.ok = function () {
            vm.dismiss({$value: 'cancel'});
        };
        vm.formatGender = function(gender) {
            if(gender === 'male') {
                return 'Boys';
            } else if(gender === 'female') {
                return 'Girls';
            } else {
                return 'Boys & Girls';
            }
        }
    }
}
export default {
    controller: RowEditCtrl,
    templateUrl: 'components/registration/edit-modal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
}