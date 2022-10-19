var db = require('../config/connection')
var collection = require('../config/collection')
var ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')

module.exports = {

    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            // collection.ADMIN_COLLECTION.password=await bcrypt.hash(adminData.password,10);
            // console.log(collection.ADMIN_COLLECTION.password);
            console.log(collection.ADMIN_COLLECTION.email + ' : ' + adminData.email)
            var data = collection.ADMIN_COLLECTION

            if (data.email == adminData.email) {
                bcrypt.compare(adminData.password, data.password).then((loginTrue) => {
                    let response = {}
                    if (loginTrue) {
                        console.log('Login success');
                        response.admin = data;
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
    },


    addUsers: (user) => {
        return new Promise((resolve, reject) => {
            
        
        console.log(user);
        let response = {}
        db.get().collection(collection.USER_COLLECTION).find({ email: user.email }).toArray().then(async(res_exist) => {
            
            if (res_exist.length != 0) {
                resolve({ status: false })
            }
            else {

                user.password = await bcrypt.hash(user.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                    console.log(data);
                    response.dataId = data.insertedId
                    response.status = true
                    resolve(response)
                })
            }
        })
    })
    },


    getAllusers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },

    deleteUser: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: ObjectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },

    getUserdetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },

    updateUser: (userId, userBody) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: ObjectId(userId) }, {
                    $set: {
                        firstName: userBody.firstName,
                        lastName: userBody.lastName,
                        email: userBody.email,

                    }
                }).then((response) => {
                    resolve()
                })
        })
    }



}
