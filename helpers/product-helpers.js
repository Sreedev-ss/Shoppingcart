var db = require('../config/connection')
var collection = require('../config/collection')
var ObjectId = require('mongodb').ObjectId
module.exports = {


    addProduct: (product, callback) => {
        console.log(product);
        db.get().collection('product').insertOne(product).then((data) => {
            console.log(data);
            callback(data.insertedId)
        })
    },

    getAllproduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },

    getProductdetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },

    updateProduct:(proId, proBody) => {
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: ObjectId(proId) }, {
                    $set: {
                        name: proBody.name,
                        category: proBody.category,
                        price: proBody.price,
                        description: proBody.description

                    }
                }).then((response)=>{
                    resolve()
                })
        })
    }


}