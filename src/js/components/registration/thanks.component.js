class ThankCtrl {
    constructor($scope, $filter, $http, $rootScope) {
        'ngInject';
        var vm = this;
        vm.$onInit = function() {
            vm.centers = vm.baseCtrl.centers;
            vm.events = vm.baseCtrl.events;
        }
        vm.formatDate = function(date) {
            return moment(date).format("Do MMM YYYY")
        }

        vm.getAge = function(doB) {
            return vm.calculateAge(moment(doB, "YYYY-MM-DD").toDate(), new Date());
        }

        vm.calculateAge = function(dateOfBirth, dateToCalculate) {
            var calculateYear = dateToCalculate.getFullYear();
            var calculateMonth = dateToCalculate.getMonth();
            var calculateDay = dateToCalculate.getDate();

            var birthYear = dateOfBirth.getFullYear();
            var birthMonth = dateOfBirth.getMonth();
            var birthDay = dateOfBirth.getDate();

            var age = calculateYear - birthYear;
            var ageMonth = calculateMonth - birthMonth;
            var ageDay = calculateDay - birthDay;

            if (ageMonth < 0 || (ageMonth == 0 && ageDay < 0)) {
                age = parseInt(age) - 1;
            }
            return age;
        }

        let registrationListener = $rootScope.$on('registered', function(event, data) {
            $scope.savedData = data;
            $scope.current_event = _.find(vm.events, {
                id: $scope.savedData.event
            });
            $scope.$apply();
        });
        $scope.$on('$destroy', registrationListener);
    }
}

export default {
    controller: ThankCtrl,
    templateUrl: 'components/registration/thanks.html',
    require: {
        baseCtrl: '^baseLayout'
    }
}