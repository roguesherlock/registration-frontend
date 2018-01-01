export default class Masters {

    constructor(AppConstants, $http, $q) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;
        this._$q = $q;
    }


    getCenters() {
        return this._$http.get(`${this._AppConstants.api}/base/centers/`, {
                cache: true
            })
            .then((res) => res.data);
    }

    getEvents() {
        return this._$http.get(`${this._AppConstants.api}/events/`, {
                cache: true,
                params: {
                    active: true
                }
            })
            .then((res) => res.data);
    }

    getCenterScopes() {
        let deferred = this._$q.defer();
        let pro1 = this._$http.get(`${this._AppConstants.api}/base/scoped-centers/`, {
                cache: true
            })
            .then((res) => res.data);
        let pro2 = this._$http.get(`${this._AppConstants.api}/base/center-scopes/`, {
                cache: true
            })
            .then((res) => res.data);
        this._$q.all([pro1, pro2]).then(function(data) {
            let gsc = _.groupBy(data[0], 'center_scope');
            let m = _.map(gsc, (v, k) => [_.find(data[1], {
                id: _.parseInt(k)
            }), v]);
            deferred.resolve(m);
        });
        return deferred.promise;
    }

}