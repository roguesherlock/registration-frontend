import angular from 'angular';

let componentsModule = angular.module('app.components', []);


import registrationForm from './registration/registration.component';
import participantList from './registration/participant.component';
import thankYou from './registration/thanks.component';
import loginForm from './auth/auth.component';
import editRow from './registration/edit-modal.component';

componentsModule.component('registrationForm', registrationForm)
				.component('editRow', editRow)
				.component('participantList', participantList)
				.component('thankYou', thankYou)
				.component('loginForm', loginForm);

export default componentsModule;