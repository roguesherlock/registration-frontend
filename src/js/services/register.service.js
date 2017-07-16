export default class Register {
	
	constructor(AppConstants, $http, $q) {
		'ngInject';

		this._AppConstants = AppConstants;
		this._$http = $http;
		this._$q = $q;
	  }


  register(participant_details) {
    return this._$http.post(`${this._AppConstants.api}/register/`, {data: participant_details})
			.then((res) => res.data);
  }
	
}