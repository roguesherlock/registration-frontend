const AppConstants = {
    api: 'http://ec2-13-126-139-189.ap-south-1.compute.amazonaws.com',
    //api: 'http://localhost:8000',
    jwtKey: 'jwtToken',
    appName: 'Fuzion Registration',
    participantSchema: {
        type: 'object',
        properties: {
            'participant.first_name': {
                type: 'string',
                title: 'Name'
            },
            // company: { type: 'string', title: 'Company' },
            // phone: { type: 'string', title: 'Phone' },
            // 'address.city': { type: 'string', title: 'City' }
        }
    }
};

export default AppConstants;