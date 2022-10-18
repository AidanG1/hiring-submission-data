const axios = require('axios');
require('dotenv').config()

function sendAxios(json_data) {
    const response = axios.put(
        'https://api.cloudflare.com/client/v4/accounts/7cbf2c7d413561731586b66773eb028b/storage/kv/namespaces/62ac40e692a046b492bb85013e80d96a/bulk',
        json_data,
        {
            headers: {
                'Authorization': 'Bearer t-ouf2fjRZgSxBXY5z88GcNh2BMCQsEZ_B45rthE',
                'Content-Type': 'application/json'
            }
        }
    )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(Object.keys(error));
            console.log(error.message);
            console.log(error.name);
            console.log(error.response.data.errors);
        });
}

module.exports = sendAxios;