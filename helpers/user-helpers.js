var collection = require('../config/collection')
const bcrypt = require('bcrypt')

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            // collection.USER_COLLECTION.password=await bcrypt.hash(collection.USER_COLLECTION.password,10);
            // console.log(collection.USER_COLLECTION.password);
            // console.log(collection.USER_COLLECTION.email + ' : ' + userData.email)
            var data = collection.USER_COLLECTION

            if (data.email == userData.email) {
                bcrypt.compare(userData.password, data.password).then((loginTrue) => {
                    let response = {}
                    if (loginTrue) {
                        console.log('Login success');
                        response.user = data;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log('Login failed');
                        resolve({ status: false });
                    }
                })
            } else {
                console.log('Login failed1');
                resolve({ status: false });
            }
        })
    }
}