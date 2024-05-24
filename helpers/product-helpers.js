var db = require('../config/db_connection')
var collection = require('../config/db_collections')

var promise = require('promise')

module.exports = {
    addProduct: (product) => {
        return (new promise((resolve, reject) => {
            db.get().collection('products').insertOne(product).then((data) => {

                resolve(data.insertedId.toString())
            })
        })
        )
    },
    getAllProducts: () => {
        return new promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.Collection_Product).find().toArray()
            resolve(products)
        })
    }
}