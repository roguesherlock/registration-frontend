import angular from 'angular';

let componentsModule = angular.module('app.components', []);


import registrationForm from './registration/registration.component';
import participantList from './registration/participant.component';
import thankYou from './registration/thanks.component';
import loginForm from './auth/auth.component';
import baseLayout from './registration/base.component';

componentsModule.component('registrationForm', registrationForm)
    .component('participantList', participantList)
    .component('thankYou', thankYou)
    .component('loginForm', loginForm)
    .component('baseLayout', baseLayout);

export default componentsModule;