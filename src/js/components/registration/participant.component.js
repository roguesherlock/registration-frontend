class ParticipantCtrl {
    constructor($scope, $filter, $http, $uibModal, $timeout, toastr, RegisterService, User, ParticipantService) {
        'ngInject';

        var vm = this;

        vm.$onInit = function() {
            vm.user_id = User.current.id;
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

        vm.formatDate = function(date) {
            return moment(date).format('Do MMM YYYY');
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

        vm.filter = function(filterOption) {
            vm.gridApi.grid.columns[1].filters[0].term = filterOption;
        }

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
                exporterFieldCallback: (grid, row, col, value) => {
                    if(col.name === 'Actions') {
                        return row.entity.registration_status === 0 ? 'Registered' : 'Cancelled';
                    }
                    if (col.name === 'gender') {
                        return vm.formatGender(value);
                    } else if (col.name === 'home_center') {
                        return vm.formatCenter(value);
                    } else if (col.name === 'accommodation' || col.name === 'payment_status') {
                        return vm.formatOptions(value);
                    } else if (col.name === 'registered_on') {
                        return vm.formatDate(value)
                    } else {
                        return value;
                    }
                },
                rowTemplate: `<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell ng-class="{'my-css-class': grid.appScope.$ctrl.rowFormatter(row)}" ></div>`,
                columnDefs: [{
                        name: 'Actions',
                        field: 'edit',
                        enableFiltering: false,
                        enableSorting: false,
                        cellTemplate: 'components/registration/edit-button.html',
                        width: 60
                    },
                    {
                        headerName: 'role',
                        field: 'role',
                        cellTemplate: `<div>{{COL_FIELD}}</div>`
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
                        name: 'registered_on',
                        field: 'created_on',
                        cellTemplate: `<div>{{grid.appScope.$ctrl.formatDate(COL_FIELD)}}</div>`
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
                onRegisterApi: function(gridApi) {
                    vm.gridApi = gridApi;
                }
                //data: v
            }
            $timeout(function() {
                grid.data = _.orderBy(v, 'registration_status');
            }, 100);
            //grid.data = v;
            vm.grids.push([event, eventCenter, grid]);
        }

        vm.export = function(type) {
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            vm.gridApi.exporter.csvExport( type, type, myElement );
        }


        vm.edit = function(uiGridComp) {
            //Get the index of selected row from row object
            var index = uiGridComp.grid.options.data.indexOf(uiGridComp.entity);
            //Use that to set the editrow attrbute value for seleted rows
            uiGridComp.grid.options.data[index].editrow = !uiGridComp.grid.options.data[index].editrow;
        };

        vm.activate = function(uiGridComp) {
            if(uiGridComp.entity.registration_status === 1) {
                uiGridComp.entity.registration_status = 0;
            } else {
                uiGridComp.entity.registration_status = 1;
            }
            vm.saveRow(uiGridComp).then((res) => {
              vm.init();  
            });
        }

        vm.rowFormatter = function(row) {
            return row.entity.registration_status === 1;
        }

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
            return RegisterService.update_profile(uiGridComp.entity).then((res) => {
                uiGridComp.grid.options.data[index].editrow = false;
                vm.baseCtrl.saving = false;
                toastr.success('Data saved successfully', '');
            }).catch((error) => {
                vm.baseCtrl.saving = false;
                toastr.error('An error occurred while saving.', '');
            });
        };

        vm.openVisualization = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                component: 'dashBoard',
                resolve: {
                    events: function () {
                        return vm.events;
                    },
                    data: function() {
                        return vm.grids[0][2].data;
                    },
                    centers: function() {
                        return vm.centers;
                    }
                }
            });
        };

        vm.logout = function() {
            User.logout();
        }

        vm.editRow = function(grid, row) {
            $uibModal.open({
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