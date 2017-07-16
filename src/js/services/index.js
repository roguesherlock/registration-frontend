import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

import MasterService from './masters';
import RegisterService from './register.service';
servicesModule.service('MasterService', MasterService)
			  .service('RegisterService', RegisterService);


export default servicesModule;
