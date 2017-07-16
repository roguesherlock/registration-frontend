class RegistrationCtrl {
	constructor($scope, RegisterService) {
		'ngInject';
		var vm = this;
		
		vm.$onInit = function() {
			console.log(vm.centers);
			console.log(vm.events);
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
		
		vm.register = function() {
			console.log($scope.registerForm);
			if ($scope.registerForm.$valid && vm.user.events && vm.user.events.length > 0) {
			
				console.log(vm.user);
				RegisterService.register(vm.user).then((data) => {
					
				}).catch((err) => {
					
				})
			}
		}
			
		
		vm.roles = [
			{id: 2, name: 'Helper'},
			{id: 3, name: 'Coordinator'}
		];
		//vm.user.events = [];
		
		
		vm.getEventAndRoleDetails = function() {
			if(!_.isNil(vm.user.dob)) {
				let age = vm.calculateAge(vm.user.dob, new Date());
				vm.roleEnabled = (age > 21);
				vm.validEvents = _.filter(vm.events, (e) => {
					return age >= e.min_age && age <= e.max_age && (vm.user.gender === e.gender || !e.gender);
				});
				if(_.isNil(vm.validEvents) || vm.validEvents.length === 0) {
					vm.validEvents = _.filter(vm.events, (e) => {
						if(e.rules) {
							console.log(age);
							console.log(vm.user.gender);
							console.log(e);
							return eval(_.template(e.rules)({'age': age, 'gender': `'${vm.user.gender}'`}));
						}
						return false;
				});
				}
			}
			
			console.log(vm.validEvents);
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
			console.log(event);
			if(_.isNil(vm.user)) {
				console.log("user is empty");
				vm.user = {};
			}
			console.log(vm.user.events);
			vm.user.events = _.isNil(vm.user.events) ? [] : vm.user.events;
			console.log(_.find(vm.user.events, {id: event.id}));
			if(_.find(vm.user.events, {id: event.id})) {
				console.log("Removed...................")
				vm.user.events = _.filter(vm.user.events, (e) => e.id !== event.id );
			} else {
				console.log("added...........")
				vm.user.events.push(event);
				console.log(vm.user.events);
			}
			
		}
		
	}
	
	
}

export default {
	controller: RegistrationCtrl,
	templateUrl: 'registration/registration.html',
	bindings: {
		centers: '=',
		events: '='
	}
}