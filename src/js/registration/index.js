import angular from 'angular';

let componentsModule1 = angular.module('app.components1', []);


import registrationForm from './registration.component'
componentsModule1.component('registrationForm', registrationForm);

export default componentsModule1;