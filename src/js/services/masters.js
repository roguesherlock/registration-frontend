export default class Masters {
	
	constructor(AppConstants, $http, $q) {
		'ngInject';

		this._AppConstants = AppConstants;
		this._$http = $http;
		this._$q = $q;
	  }


  getCenters() {
    /*return this._$.get(`${this._AppConstants.api}/centers/`)
			.then((res) => res.data);*/
	
	// Test data
	let centers = [
			{id: 1, name: 'Ahmedabad'},
			{id: 2, name: 'Sim City'},
			{id: 3, name: 'Baroda'},
			{name: 'Other'}
			];
	let defer = this._$q.defer();
	defer.resolve(centers);
	return defer.promise;

  }
  
  getEvents() {
    /*return this._$.get(`${this._AppConstants.api}/events/`)
			.then((res) => res.data);*/
	let events = [
			{
				id: 1,
				name: 'Test1',
				min_age: 13,
				max_age: 16,
				gender: 'M'
			},
			{
				id: 2,
				name: 'Test2',
				min_age: 13,
				max_age: 16,
				gender: 'F'
			},
			{
				id: 3,
				name: 'Test3',
				min_age: 8,
				max_age: 12,
				rules: "${age} > 21 && ${gender} === 'F'"
			},
			{
				id: 4,
				name: 'Test4',
				min_age: 13,
				max_age: 16,
				gender: 'M'
			}
		];
	let defer = this._$q.defer();
	defer.resolve(events);
	return defer.promise;
  }
	
}