import authInterceptor from './auth.interceptor'

function AppConfig($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';

    $httpProvider.interceptors.push(authInterceptor);

    /*
      If you don't want hashbang routing, uncomment this line.
      Our tutorial will be using hashbang routing though :)
    */
    // $locationProvider.html5Mode(true);

    /*$stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'layout/app-view.html',
      resolve: {
        auth: function(User) {
          return User.verifyAuth();
        }
      }
    });*/
    $stateProvider
        .state('base', {
            url: "",
            abstract: true,
            resolve: {
                centers: fetchCenters,
                events: fetchEvents
            },
            template: '<base-layout centers="$resolve.centers" events="$resolve.events"></base-layout>'
        })
        .state('base.register', {
            url: '/register',
            template: '<registration-form></registration-form>'
        })
        .state('base.thanks', {
            url: '/thanks',
            template: '<thank-you></thank-you>'
        })
        .state('login', {
            url: '/login',
            template: '<login-form></login-form>',
            resolve: {
                auth: function(User) {
                    return User.ensureAuthIs(false);
                }
            }
        })
        .state('list', {
            url: '/list',
            template: '<participant-list participant-list="$resolve.participantList" centers="$resolve.centers" events="$resolve.events"></participant-list>',
            resolve: {
                participantList: function(ParticipantService) {
                    return ParticipantService.get_list();
                },
                centers: fetchCenters,
                events: fetchEvents
            }
        });

    $urlRouterProvider.otherwise('/');

    function fetchCenters(MasterService) {
        return MasterService.getCenters().then((res) => res);
    }

    function fetchEvents(MasterService) {
        return MasterService.getEvents().then((res) => res);
    }
}

export default AppConfig;