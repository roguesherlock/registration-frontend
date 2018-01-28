import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

import MasterService from './masters';
import RegisterService from './register.service';
import UserService from './user.service';
import JWTService from './jwt.service';
import ParticipantService from './participant.service';
import DataStoreService from './datastore.service';

servicesModule.service('MasterService', MasterService)
    .service('RegisterService', RegisterService)
    .service('User', UserService)
    .service('JWT', JWTService)
    .service('ParticipantService', ParticipantService)
    .service('DataStoreService', DataStoreService)


export default servicesModule;