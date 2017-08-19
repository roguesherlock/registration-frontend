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

        // Test data
        // let centers = [
        // 		{id: 1, name: 'Ahmedabad'},
        // 		{id: 2, name: 'Sim City'},
        // 		{id: 3, name: 'Baroda'},
        // 		{name: 'Other'}
        // 		];
        // let defer = this._$q.defer();
        // defer.resolve(centers);
        // return defer.promise;

    }

    getEvents() {
        return this._$http.get(`${this._AppConstants.api}/events/`, {
                cache: true
            })
            .then((res) => res.data);
        /*let events = [
        		{
        			id: 1,
        			name: 'Test1',
        			min_age: 13,
        			max_age: 16,
        			gender: 'male',
        			accomodation: true,
        			center: 2,
        			rules:  "${age} > 21 && ${gender} === 'male'"
        		},
        		{
        			id: 2,
        			name: 'Test2',
        			min_age: 13,
        			max_age: 16,
        			gender: 'female',
        			accomodation: true,
        			center: 2
        		},
        		{
        			id: 3,
        			name: 'Test3',
        			min_age: 8,
        			max_age: 12,
        			rules: "${age} > 21 && ${gender} === 'female'",
        			accomodation: false,
        			center: 2
        		},
        		{
        			id: 4,
        			name: 'Test4',
        			min_age: 13,
        			max_age: 16,
        			gender: 'nale',
        			accomodation: false,
        			center: 2
        		}
        	];
        let defer = this._$q.defer();
        defer.resolve(events);
        return defer.promise;*/
    }

    fetchParticipantList() {
        let participants = [{
                id: 1,
                name: 'Test1',
                min_age: 13,
                max_age: 16,
                gender: 'M',
                accomodation: true
            },
            {
                id: 2,
                name: 'Test2',
                min_age: 13,
                max_age: 16,
                gender: 'F',
                accomodation: true
            },
            {
                id: 3,
                name: 'Test3',
                min_age: 8,
                max_age: 12,
                rules: "${age} > 21 && ${gender} === 'F'",
                accomodation: false
            },
            {
                id: 4,
                name: 'Test4',
                min_age: 13,
                max_age: 16,
                gender: 'M',
                accomodation: false
            }
        ];
        let defer = this._$q.defer();
        defer.resolve(participants);
        return defer.promise
    }

}