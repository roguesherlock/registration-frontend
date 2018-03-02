class DashBoardCtrl {

    constructor($scope, DataStoreService, User) {
        'ngInject';
        var vm = this;
        vm.$onInit = function() {
            vm.user_id = User.current.id;
            $scope.myChartObject = {};
            $scope.myChartObject.type = "PieChart";
            let activeRegistrations = _.filter(DataStoreService.get("participants"), (p) => {
                return p.registration_status === 0;
            }); 
            let rows = _.map(_.groupBy(activeRegistrations, 'home_center'), (val, k) => {
                let center = _.find(DataStoreService.get("centers"), {id: _.parseInt(k)});
                center = !center ? 'Unknown' : center.name;
                return {
                        c: [
                            {v: center},
                            {v: val.length}
                        ]
                    }
            });
            $scope.myChartObject.data = {
                "cols": [
                    {id: "t", label: "Center", type: "string"},
                    {id: "s", label: "Participants", type: "number"}                    
                ],
                "rows": rows
            };
            $scope.myCenterChartObject = {};
            $scope.myCenterChartObject.type = "ColumnChart";
            $scope.myCenterChartObject.annotations = {
                alwaysOutside: true,
                'column_id': {style: 'line'}
            };	 

            $scope.myCenterChartObject.data = {
                "cols": [
                    {id: "t", label: "Center", type: "string"},
                    {id: "s", label: "Participants", type: "number"},
                    { calc: "stringify",sourceColumn: 1, type:'string', role:'annotation'}
                ],
                "rows": rows
            };
            let rows1 = _.map(_.groupBy(_.map(activeRegistrations, (aR) => {
                let age = vm.getAge(aR.participant.date_of_birth);
                aR.age_group = (age > 16 ? (age > 21 ? 'Above 21' : '17 - 21 Age Group') : '13 - 16 Age Group');
                return aR;
            }), 'age_group'), (val, k) => {
                return {
                        c: [
                            {v: k},
                            {v: val.length}
                        ]
                    }
            });
            $scope.myAgeChartObject = {};
            $scope.myAgeChartObject.type = "PieChart";
            $scope.myAgeChartObject.data = {
                "cols": [
                    {id: "t", label: "Age", type: "string"},
                    {id: "s", label: "Participants", type: "number"}
                ],
                "rows": rows1
            };
        }
        vm.getAge = function(doB) {
            return vm.calculateAge(moment(doB, "YYYY-MM-DD").toDate(), new Date());
        }
        vm.ok = function () {
            vm.dismiss({$value: 'cancel'});
        };
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

        vm.logout = function() {
            User.logout();
        }
    }

}
export default {
    controller: DashBoardCtrl,
    templateUrl: 'components/registration/dashboard.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    require: {
        baseCtrl: '^baseLayout'
    }
}