class ParticipantCtrl {
	constructor($scope, $filter, $http, $uibModal, toastr, RegisterService) {
		'ngInject';

		var vm = this;

		vm.$onInit = function() {
			console.log(vm.participantList);
			console.log(vm.centers);
			console.log(vm.events);
			vm.initGrid();
		}

		vm.initGrid = function() {
			vm.gridOptions = {
				enableSorting: true,
				enableFiltering: true,
				exporterMenuPdf: false,
    		enableGridMenu: true,
				rowHeight: 40,
        columnDefs: [
					{
						name: 'Actions', field: 'edit', enableFiltering: false, enableSorting: false,
						cellTemplate: 'components/registration/edit-button.html', width: 100
          },
					{ 
						name:'firstName', field: 'participant.first_name', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>`
					},
					{
						name:'lastName', field: 'participant.last_name', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>` 
					},
					{ 
						name:'birthDate', field: 'participant.date_of_birth',
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow">
						<input ui-date="{dateFormat: 'dd mm yyyy'}" type="date" ui-date-format="dd mm yyyy" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>`,
						cellFilter: `date:'dd/MM/yyyy'`
					},
					{ 
						name:'gender', field: 'participant.gender',
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow">
						<select style="height:30px" data-ng-options="t for t in ['male', 'female']" data-ng-model="MODEL_COL_FIELD"></select></div>`
					},
					{ 
						name:'email', field: 'participant.email', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="email" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
					},
					{ name:'event_center', field: 'event_center', 
						cellTemplate: `
						<div ng-disabled="!row.entity.editrow">
						<select ng-disabled="!row.entity.editrow"style="height:30px" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
						</div>`},
					{ name:'home_center', field: 'home_center', 
						cellTemplate: `<div  ng-disabled="!row.entity.editrow">
						<select  ng-disabled="!row.entity.editrow" style="height:30px" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
						</div>`},
					{ 
						name:'mobile', field: 'participant.mobile', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
				  },
					{ 
						name:'fatherName', field: 'participant.father_name', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
					},
					{ 
						name:'fatherMobile', field: 'participant.father_mobile', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
					},
					{ name:'motherName', field: 'participant.mother_name', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>` },
          { name:'motherMobile', field: 'participant.mother_mobile', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>` },
          { name:'accommodation', field: 'accommodation', 
						cellTemplate: `<div  ng-if="!row.entity.editrow"><i class="fa fa-check btn btn-xs btn-success" ng-if="COL_FIELD" disabled></i><i class="fa fa-close btn btn-xs btn-danger" ng-if="!COL_FIELD" disabled></i></div>
						<div ng-if="row.entity.editrow"><input type="checkbox" style="height:30px" class="checkbox checkbox-success" ng-model="MODEL_COL_FIELD"/></div>`},
					{ name:'amount_paid', field: 'amount_paid', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
					{ name:'cashier', field: 'cashier', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
					{ name:'payment_status', field: 'payment_status', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
					{ name:'registration_no', field: 'registration_no', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
					{ headerName:'big_buddy', field: 'big_buddy', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
					{ headerName:'goal_achievement', field: 'goal_achievement', 
						cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
						<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`}
        ],
        data : vm.participantList
			}

			// 	vm.gridOptions1 = {
      //   columnDefs: [
			// 		{
			// 			headerName: 'Actions', field: 'edit', suppressFilter: true, enableSorting: false,
			// 			templateUrl: 'components/registration/edit-button.html', width: 100
      //     },
			// 		{ 
			// 			headerName:'firstName', field: 'participant.first_name', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>`
			// 		},
			// 		{
			// 			headerName:'lastName', field: 'participant.last_name', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>` 
			// 		},
			// 		{ 
			// 			headerName:'birthDate', field: 'participant.date_of_birth',
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow">
			// 			<input ui-date="{dateFormat: 'dd mm yyyy'}" type="date" ui-date-format="dd mm yyyy" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>`,
			// 			cellFilter: `date:'dd/MM/yyyy'`
			// 		},
			// 		{ 
			// 			headerName:'gender', field: 'participant.gender',
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow">
			// 			<select style="height:30px" data-ng-options="t for t in ['male', 'female']" data-ng-model="MODEL_COL_FIELD"></select></div>`
			// 		},
			// 		{ 
			// 			headerName:'email', field: 'participant.email', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="email" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
			// 		},
			// 		{ headerName:'Event Center', field: 'event_center', 
			// 			cellTemplate: `
			// 			<div ng-disabled="!row.entity.editrow">
			// 			<select ng-disabled="!row.entity.editrow"style="height:30px" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
			// 			</div>`},
			// 		{ headerName:'Home Center', field: 'home_center', 
			// 			cellTemplate: `<div  ng-disabled="!row.entity.editrow">
			// 			<select  ng-disabled="!row.entity.editrow" style="height:30px" data-ng-options="t.id as t.name for t in grid.appScope.$ctrl.centers" data-ng-model="MODEL_COL_FIELD"></select>
			// 			</div>`},
			// 		{ 
			// 			headerName:'mobile', field: 'participant.mobile', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
			// 	  },
			// 		{ 
			// 			headerName:'fatherName', field: 'participant.father_name', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
			// 		},
			// 		{ 
			// 			headerName:'fatherMobile', field: 'participant.father_mobile', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`
			// 		},
			// 		{ headerName:'motherName', field: 'participant.mother_name', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>` },
      //     { headerName:'motherMobile', field: 'participant.mother_mobile', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="tel" style="height:30px" ng-model="MODEL_COL_FIELD"</div>` },
      //     { headerName:'accommodation', field: 'accommodation', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow"><i class="fa fa-check btn btn-xs btn-success" ng-if="COL_FIELD" disabled></i><i class="fa fa-close btn btn-xs btn-danger" ng-if="!COL_FIELD" disabled></i></div>
			// 			<div ng-if="row.entity.editrow"><input type="checkbox" style="height:30px" class="checkbox checkbox-success" ng-model="MODEL_COL_FIELD"/></div>`},
			// 		{ headerName:'amount_paid', field: 'amount_paid', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
			// 		{ headerName:'cashier', field: 'cashier', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
			// 		{ headerName:'payment_status', field: 'payment_status', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
			// 		{ headerName:'registration_no', field: 'registration_no', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
			// 		{ headerName:'big_buddy', field: 'big_buddy', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`},
			// 		{ headerName:'goal_achievement', field: 'goal_achievement', 
			// 			cellTemplate: `<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div>
			// 			<div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>`}
      //   ],
			// 	rowData : vm.participantList,
			// 	defaultColDef: {
      //   // set every column width
			// 		width: 100,
			// 		// make every column editable
			// 		editable: true,
			// 		// make every column use 'text' filter by default
			// 		filter: 'text'
			// 	},	
			// 	enableFilter: true,
			// 	floatingFilter: true,
			// 	enableColResize: true,
      //   enableSorting: true,

      // }



		}

		vm.edit = function (row) {
        //Get the index of selected row from row object
        var index = vm.gridOptions.data.indexOf(row);
        //Use that to set the editrow attrbute value for seleted rows
        vm.gridOptions.data[index].editrow = !vm.gridOptions.data[index].editrow;
    };

		vm.cancelEdit = function (row) {
        //Get the index of selected row from row object
        var index = vm.gridOptions.data.indexOf(row);
        //Use that to set the editrow attrbute value to false
        vm.gridOptions.data[index].editrow = false;
        //Display Successfull message after save
        toastr.info('Row editing cancelled', 'info');
		};
			
		vm.saveRow = function (row) {
        //get the index of selected row 
				var index = vm.gridOptions.data.indexOf(row);
				row.participant.date_of_birth = moment(row.participant.date_of_birth).format("YYYY-MM-DD")
				//Remove the edit mode when user click on Save button
				RegisterService.update_profile(row).then((res) => {
					vm.gridOptions.data[index].editrow = false;
					toastr.success('Data saved successfully', '');
				}).catch((error) => {
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

		vm.editRow = function(grid, row) {
			console.log(grid, row);
			console.log("rrrrrrr");
			$uibModal.open({
				//templateUrl: 'components/registration/edit-modal.html',
				//controller: ['$modalInstance', 'grid', 'row', RowEditCtrl],
				component: 'editRow',
				resolve: {
					grid: function () { return grid; },
					row: function () { return row; }
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
	}
}