export default class User {
    constructor(JWT, AppConstants, $http, $state, $q) {
        'ngInject';

        this._JWT = JWT;
        this._AppConstants = AppConstants;
        this._$http = $http;
        this._$state = $state;
        this._$q = $q;

        this.current = null;

    }


    attemptAuth(type, credentials) {
        let route = (type === 'login') ? '/login' : '';
        return this._$http({
            url: `${this._AppConstants.api}/api-token-auth/`,
            method: 'POST',
            data: credentials
        }).then(
            (res) => {
                this._JWT.save(res.data.token);
                return this._$http.get(`${this._AppConstants.api}/me`).then((res) => {
                    this.current = res.data;
                }).catch((error) => {

                });
                //return res;
            }
        );
    }

    update(fields) {
        return this._$http({
            url: this._AppConstants.api + '/user',
            method: 'PUT',
            data: {
                user: fields
            }
        }).then(
            (res) => {
                this.current = res.data.user;
                return res.data.user;
            }
        )
    }

    logout() {
        this.current = null;
        this._JWT.destroy();
        this._$state.go('baseLogin.login', null, {
            reload: true
        });
    }

    verifyAuth() {
        let deferred = this._$q.defer();

        // check for JWT token
        if (!this._JWT.get()) {
            deferred.resolve(false);
            return deferred.promise;
        }

        if (this.current) {
            deferred.resolve(true);

        } else {
            this._$http({
                url: `${this._AppConstants.api}/me`,
                method: 'GET',
                headers: {
                    Authorization: 'JWT ' + this._JWT.get()
                }
            }).then(
                (res) => {
                    this.current = res.data;
                    deferred.resolve(true);
                },
                (err) => {
                    this._JWT.destroy();
                    deferred.resolve(false);
                }
            )
        }

        return deferred.promise;
    }


    ensureAuthIs(bool) {
        let deferred = this._$q.defer();

        this.verifyAuth().then((authValid) => {
            if (authValid !== bool) {
                this._$state.go('baseLogin.list');
                deferred.resolve(false);
            } else {
                deferred.resolve(true);
            }

        });

        return deferred.promise;
    }

}