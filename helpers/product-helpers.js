var db = require('../config/db_connection')

var promise = require('promise')

module.exports = {
    addProduct: (product) => {
        return (new promise((resolve, reject) => {
            db.get().collection('products').insertOne(product).then((data) => {

                resolve(data.insertedId.toString())
            })
        })
        )
    }
}