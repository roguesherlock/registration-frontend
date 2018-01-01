class RegistrationCtrl {
    constructor($scope, $state, $q, $rootScope, $uibModal, toastr, RegisterService) {
        'ngInject';
        var vm = this;
        vm._ = _;
        vm.$onInit = function() {
            vm.centers = vm.baseCtrl.centers;
            vm.events = vm.baseCtrl.events;
            vm.centerScopes = vm.baseCtrl.centerScopes;
            vm.months = moment().localeData().months();
            vm.other_center = _.find(vm.centers, {
                name: 'Other'
            }).id;
        }

        vm.format = 'dd-MMMM-yyyy';
        vm.popup1 = {
            opened: false
        };
        vm.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(1900, 1, 1),
            startingDay: 1
        };
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.open1 = function() {
            vm.popup1.opened = true;
        };

        vm.setHomeCenter = function(model) {
            if (_.isNil(vm.user)) {
                vm.user = {};
            }
            vm.user.center = model.id;
            vm.getEventAndRoleDetails();
        }

        vm.register = function() {
            if ($scope.registerForm.$valid && vm.user.events && vm.user.events.length > 0) {
                var abs = true;
                _.each(vm.user.events, (e1) => {
                    if(_.isNil(e1.require_accomodation) && e1.accommodation_provided) {
                        toastr.error('Please select utaro.', '');
                        abs = false;
                    }                    
                });
                if(!abs) return;
                let promises = [];
                vm.baseCtrl.saving = true;
                _.each(vm.user.events, (tempEvent) => {
                    let data = {
                        participant: angular.copy(vm.user),
                        event: tempEvent.id,
                        //registration_no: "",
                        accommodation: tempEvent.require_accomodation || false,
                        payment_status: false,
                        amount_paid: 0,
                        //cashier: "",
                        role: vm.user.role || "participant",
                        home_center: vm.user.center,
                        event_center: tempEvent.center,
                        big_buddy: vm.user.big_buddy,
                        goal_achievement: vm.user.goal_achievement
                    }
                    data.participant.date_of_birth = moment(data.participant.date_of_birth).format("YYYY-MM-DD");
                    promises.push(RegisterService.register(data));
                });
                $q.all(promises).then((data) => {
                    vm.baseCtrl.saving = false;
                    $state.go('base.thanks');
                    _.defer(function() {
                        $rootScope.$emit('registered', data[0]);
                    });
                }).catch((err) => {
                    vm.baseCtrl.saving = false;
                });
            }
        }


        vm.roles = [{
                id: 2,
                name: 'helper'
            },
            {
                id: 3,
                name: 'coordinator'
            }
        ];
        //vm.user.events = [];


        vm.getEventAndRoleDetails = function() {
            vm.validCenters = [];
            vm.validEvents = [];
            vm.user.events = [];
            //delete vm.home_center;
            //delete vm.user.center;
            _.each(vm.events, (e) => {
                delete e.selected;
                delete e.require_accomodation;
            });
            if(moment(`${vm.day}-${vm.month}-${vm.year}`, "DD-MMMM-YYYY").isValid()) {
                vm.user.date_of_birth = moment(`${vm.day}-${vm.month}-${vm.year}`, "DD-MMMM-YYYY").toDate();
            } else {
                vm.user.date_of_birth = null;
            }
            if (!_.isNil(vm.user.date_of_birth)) {
                let age = vm.calculateAge(vm.user.date_of_birth, new Date());
                //console.log("0", vm.centerScopes);
                let validCenterScopes = _.filter(vm.centerScopes, (cs) => {
                    return age >= _.parseInt(cs[0].min_age) && age <= _.parseInt(cs[0].max_age) && (vm.user.gender === cs[0].gender || !cs[0].gender);
                });
                //console.log("1", validCenterScopes);
                if (_.isNil(validCenterScopes) || validCenterScopes.length === 0) {
                    if(vm.user.gender === 'male') {
                        validCenterScopes = _.filter(vm.centerScopes, (cen) => {
                            return cen[0].gender === 'male';
                        });
                    } else if(vm.user.gender === 'female') {
                        validCenterScopes = _.filter(vm.centerScopes, (cen) => {
                            return !cen[0].gender || cen[0].gender === 'female';
                        });
                    }
                } 
                if (_.isNil(validCenterScopes) || validCenterScopes.length === 0) {
                    vm.validCenters = vm.centers;
                } else {
                    let validCentersIds = _.flatten(_.map(validCenterScopes, (cs) => _.map(cs[1], (h) => h.center)));
                    //console.log("2", validCentersIds);
                    vm.validCenters = _.filter(vm.centers, (c) => _.includes(validCentersIds, c.id));
                }
                vm.validCenters = _.orderBy(vm.validCenters, 'name');
                //console.log("3", validCenterScopes)
                //console.log("4", vm.validCenters);
                vm.user.age = age;
                vm.roleEnabled = (age > 21);
                vm.validEvents = _.filter(vm.events, (e) => {
                    return age >= _.parseInt(e.min_age) && age <= _.parseInt(e.max_age) && (vm.user.gender === e.gender || !e.gender) && 
                    (vm.home_center.id === e.center || e.center === 1);
                });
                if (_.isNil(vm.validEvents) || vm.validEvents.length === 0) {
                    vm.validEvents = _.filter(vm.events, (e) => {
                        if (e.rules) {
                            return eval(_.template(e.rules)({
                                'age': age,
                                'gender': `'${vm.user.gender}'`
                            }));
                        }
                        return false;
                    });
                }
                if (vm.validEvents.length === 1) {
                    vm.addEvent(vm.validEvents[0]);
                    vm.validEvents[0].selected = true;
                }
            }
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

        vm.addEvent = function(event) {
            if (_.isNil(vm.user)) {
                vm.user = {};
            }
            vm.user.events = _.isNil(vm.user.events) ? [] : vm.user.events;
            if (_.find(vm.user.events, {
                    id: event.id
                })) {
                event.require_accomodation = false;
                vm.user.events = _.filter(vm.user.events, (e) => e.id !== event.id);
            } else {
                vm.user.events.push(event);
            }

        }

        vm.openComponentModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                component: 'eventDetails',
                resolve: {
                    events: function () {
                        return vm.events;
                    }
                }
            });
        };
    }


}

export default {
    controller: RegistrationCtrl,
    templateUrl: 'components/registration/registration.html',
    require: {
        baseCtrl: '^baseLayout'
    }
}