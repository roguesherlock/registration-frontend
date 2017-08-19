class ThankCtrl {
    constructor($scope, $filter, $http, $rootScope) {
        'ngInject';
        var vm = this;
        vm.$onInit = function() {
            vm.centers = vm.baseCtrl.centers;    
            vm.events = vm.baseCtrl.events;
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