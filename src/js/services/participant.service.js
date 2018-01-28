export default class ParticipantService {

    constructor(AppConstants, $http, $q) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;
        this._$q = $q;
    }


    get_list(event_id, user_center) {
        return this._$http.get(`${this._AppConstants.api}/events/event-participants/`, {
            params: {
                event: event_id
            }
        }).then((res) => res.data);
    }

}