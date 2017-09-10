class ParticipantCtrl {
    constructor($scope, $filter, $http, $uibModal, $timeout, toastr, RegisterService, User) {
        'ngInject';

        var vm = this;

        vm.$onInit = function() {
            console.log(vm.baseCtrl.auth);
            vm.init();
            vm.yesNoOptions = [{
                    id: true,
                    value: 'Yes'
                },
                {
                    id: false,
                    value: 'No'
                }
            ];
            vm.genderOptions = [{
                    id: 'male',
                    value: 'Boy'
                },
                {
                    id: 'female',
                    value: 'Girl'
                },
            ];
        }

        vm.init = function() {
            if (vm.participantList.length > 0) {
                let validEvents = _.filter(vm.events, (event) => {
                    return _.inRange(_.parseInt(User.current.min_age), _.parseInt(event.min_age), _.parseInt(event.max_age) + 1) &&
                        _.inRange(_.parseInt(User.current.max_age), _.parseInt(event.min_age), _.parseInt(event.max_age) + 1) &&
                        (event.gender === User.current.gender);
                }).map((validEvent) => {
                    return validEvent.id;
                });
                var validParticipantList = _.filter(vm.participantList, (participant) => {
                    return _.includes(validEvents, participant.event) &&
                        (participant.event_center === User.current.center ||
                            participant.home_center === User.current.center)
                });
                var event_participants_hash = _.groupBy(validParticipantList, 'event');
            }
            vm.grids = [];
            _.forEach(event_participants_hash, (v, k) => {
                vm.initGrid(k, v);
            });
        }


        vm.formatGender = function(value) {
            let tempValue = _.find(vm.genderOptions, {
                id: value
            });
            return tempValue ? tempValue.value : value;
        }

        vm.formatCenter = function(center_id) {
            let tempCenter = _.find(vm.centers, {
                id: center_id
            });
            return tempCenter ? tempCenter.name : center_id;
        }

        vm.formatOptions = function(option) {
            let tempOption = _.find(vm.yesNoOptions, {
                id: option
            });
            return tempOption ? tempOption.value : option;
        }

        vm.custom_cols = [{
                name: 'gender',
                func: 'vm.formatGender'
            },
            {
                name: 'home_center',
                func: 'vm.formatCenter'
            },
            {
                name: 'accommodation',
                func: 'vm.formatOptions'
            },
            {
                name: 'payment_status',
                func: 'vm.formatOptions'
            }
        ];

        vm.initGrid = function(k, v) {
            let event = _.find(vm.events, {
                id: _.toInteger(k)
            });
            let eventCenter = _.find(vm.centers, {
                id: _.toInteger(v[0].event_center)
            });
            let grid = {
                paginationPageSizes: [25, 50, 100, 200, 500],
                paginationPageSize: 50,
                enableSorting: true,
                enableFiltering: true,
                exporterMenuPdf: false,
                enableGridMenu: true,
                rowHeight: 40,
                fastWatch: true,
                exporterSuppressColumns: ['edit'],
                exporterFieldCallback: (grid, row, col, value) => {
                    if (col.name === 'gender') {
                        return vm.formatGender(value);
                    } else if (col.name === 'home_center') {
                        return vm.formatCenter(value);
                    } else if (col.name === 'accommodation' || col.name === 'payment_status') {
                        return vm.formatOptions(value);
                    } else {
                        return value;
                    }
                },
                columnDefs: [{
                        name: 'Actions',
                        field: 'edit',
                        enableFiltering: false,
                        enableSorting: false,
                        cellTemplate: 'components/registration/edit-button.html',
                        width: 60
                    },
                    {
                        name: 'registration_no',
                        field: 'registration_no',
                        cellTemplate: `<div>{{COL_FIELD}}</div>`
                    },
                    {
                        name: 'firstName',
                        field: 'participant.first_name',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"/></div>`
                    },
                    {
                        name: 'lastName',
                        field: 'participant.last_name',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"/></div>`
                    },
                    {
                        name: 'birthDate',
                        field: 'participant.date_of_birth',
                        cellTemplate: `<div>{{COL_FIELD}}</div>`,
                        //cellFilter: `date:'dd/MM/yyyy'`
                    },
                    {
                        name: 'gender',
                        field: 'participant.gender',
                        cellTemplate: `<div>{{grid.appScope.$ctrl.formatGender(COL_FIELD)}}</div>`
                    },
                    {
                        name: 'email',
                        field: 'participant.email',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="email" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    /*{
                        name: 'event_center',
                        field: 'event_center',
                        cellTemplate: `
						<div ng-disabled="!row.entity.editrow">
						<select ng-disabled="!row.entity.editrow"style="height:30px" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
						</div>`
                    },*/
                    {
                        name: 'home_center',
                        field: 'home_center',
                        cellTemplate: `<div  ng-disabled="true">
						<select  ng-disabled="true" class="form-control" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
                        </div>`
                    },
                    {
                        name: 'mobile',
                        field: 'participant.mobile',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'fatherName',
                        field: 'participant.father_name',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'fatherMobile',
                        field: 'participant.father_mobile',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'motherName',
                        field: 'participant.mother_name',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'motherMobile',
                        field: 'participant.mother_mobile',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'accommodation',
                        field: 'accommodation',
                        cellTemplate: `<div  ng-if="!row.entity.editrow"><i class="fa fa-check btn btn-xs btn-success" ng-if="COL_FIELD" disabled></i><i class="fa fa-close btn btn-xs btn-danger" ng-if="!COL_FIELD" disabled></i></div>
                        <div ng-if="row.entity.editrow">
						<select class="form-control" ng-disabled="!row.entity.editrow" class="form-control" data-ng-options="t.id as t.value for t in grid.appScope.$ctrl.yesNoOptions" data-ng-model="MODEL_COL_FIELD"></select>
						</div>`
                    },
                    {
                        name: 'amount_paid',
                        field: 'amount_paid',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'cashier',
                        field: 'cashier',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    },
                    {
                        name: 'payment_status',
                        field: 'payment_status',
                        cellTemplate: `<div  ng-if="!row.entity.editrow"><i class="fa fa-check btn btn-xs btn-success" ng-if="COL_FIELD" disabled></i><i class="fa fa-close btn btn-xs btn-danger" ng-if="!COL_FIELD" disabled></i></div>
                        <div ng-if="row.entity.editrow">
						<select class="form-control" ng-disabled="!row.entity.editrow" class="form-control" data-ng-options="t.id as t.value for t in grid.appScope.$ctrl.yesNoOptions" data-ng-model="MODEL_COL_FIELD"></select>
						</div>`
                    },
                    {
                        headerName: 'big_buddy',
                        field: 'big_buddy',
                        cellTemplate: `<div>{{COL_FIELD}}</div>`
                    },
                    {
                        headerName: 'goal_achievement',
                        field: 'goal_achievement',
                        cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" class="form-control" ng-model="MODEL_COL_FIELD"</div>`
                    }
                ],
                //data: v
            }
            $timeout(function() {
                grid.data = v;
            }, 100);
            //grid.data = v;
            vm.grids.push([event, eventCenter, grid]);
        }


        vm.edit = function(uiGridComp) {
            //Get the index of selected row from row object
            var index = uiGridComp.grid.options.data.indexOf(uiGridComp.entity);
            //Use that to set the editrow attrbute value for seleted rows
            uiGridComp.grid.options.data[index].editrow = !uiGridComp.grid.options.data[index].editrow;
        };

        vm.cancelEdit = function(uiGridComp) {
            //Get the index of selected row from row object
            var index = uiGridComp.grid.options.data.indexOf(uiGridComp.entity);
            //Use that to set the editrow attrbute value to false
            uiGridComp.grid.options.data[index].editrow = false;
            //Display Successfull message after save
            toastr.info('Row editing cancelled', 'info');
        };

        vm.saveRow = function(uiGridComp) {
            //get the index of selected row 
            var index = uiGridComp.grid.options.data.indexOf(uiGridComp.entity);
            uiGridComp.entity.participant.date_of_birth = moment(uiGridComp.entity.participant.date_of_birth).format("YYYY-MM-DD")
            //Remove the edit mode when user click on Save button
            vm.baseCtrl.saving = true;
            RegisterService.update_profile(uiGridComp.entity).then((res) => {
                uiGridComp.grid.options.data[index].editrow = false;
                vm.baseCtrl.saving = false;
                toastr.success('Data saved successfully', '');
            }).catch((error) => {
                vm.baseCtrl.saving = false;
                toastr.error('An error occurred while saving.', '');
            });


            //Call the function to save the data to database
            // CustomerService.SaveCustomer($scope).then(function (d) {
            //     //Display Successfull message after save
            //     $scope.alerts.push({
            //         msg: 'Data saved successfully',
            //         type: 'success'
            //     });
            // }, function (d) {
            //     //Display Error message if any error occurs
            //     $scope.alerts.push({
            //         msg: d.data,
            //         type: 'danger'
            //     });
            // });
        };

        vm.logout = function() {
            User.logout();
        }

        vm.editRow = function(grid, row) {
            $uibModal.open({
                //templateUrl: 'components/registration/edit-modal.html',
                //controller: ['$modalInstance', 'grid', 'row', RowEditCtrl],
                component: 'editRow',
                resolve: {
                    grid: function() {
                        return grid;
                    },
                    row: function() {
                        return row;
                    }
                }
            });
        }
    }
}

export default {
    controller: ParticipantCtrl,
    templateUrl: 'components/registration/participantList.html',
    bindings: {
        participantList: '=',
        centers: '=',
        events: '='
    },
    require: {
        baseCtrl: '^baseLayout'
    }
}