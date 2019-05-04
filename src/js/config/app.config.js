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
                events: fetchEvents,
                centerScopes: fetchCenterScopes
            },
            template: '<base-layout centers="$resolve.centers" events="$resolve.events", center-scopes="$resolve.centerScopes"></base-layout>'
        })
        .state('base.register', {
            url: '/register',
            template: '<registration-form></registration-form>',
            params: {
                val : 'Summer'
            }
        })
        .state('base.listPage', {
            url: '/details',
            template: '<list-page></list-page>'
        })
        .state('base.thanks', {
            url: '/thanks',
            template: '<thank-you></thank-you>'
        })
        .state('baseLogin', {
            url: "",
            abstract: true,
            resolve: {
                auth: function (User) {
                    return User.verifyAuth();
                }
            },
            template: `<base-layout></base-layout>`
        })
        .state('baseLogin.login', {
            url: '/login',
            template: '<login-form></login-form>',
            resolve: {
                auth: function (User) {
                    return User.ensureAuthIs(false);
                }
            }
        })
        .state('baseLogin.list', {
            url: '/list',
            template: '<participant-list centers="$resolve.centers" events="$resolve.events"></participant-list>',
            resolve: {
                // participantList: function(ParticipantService) {
                //     return ParticipantService.get_list();
                // },
                centers: fetchCenters,
                events: fetchEvents,
                centerScopes: fetchCenterScopes
            }
        })
        .state('baseLogin.dashboard', {
            url: '/dashboard',
            template: '<dash-board></dash-board>'
        });

    $urlRouterProvider.otherwise('/login');

    function fetchCenters(MasterService, DataStoreService) {
        return MasterService.getCenters().then((res) => {
            DataStoreService.add('centers', res);
            return res;
        });
    }

    function fetchEvents(MasterService, DataStoreService) {
        return MasterService.getEvents().then((res) => {
            DataStoreService.add('events', res);
            return res;
        });
    }

    function fetchCenterScopes(MasterService) {
        return MasterService.getCenterScopes().then((res) => res);
    }
}

export default AppConfig;