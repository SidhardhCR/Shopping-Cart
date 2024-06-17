var db = require('../config/db_connection')
var collection = require('../config/db_collections')
var objectId = require('mongodb').ObjectId

var promise = require('promise')
const { ObjectId } = require('mongodb')


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
    },
    deleteProduct: (proId) => {

        return new promise((reslove, reject) => {
            console.log(proId)
            db.get().collection(collection.Collection_Product).deleteOne({ _id: new objectId(proId) }).then((response) => {
                reslove(response)
            })

        })
    },
    getProductDetails: (proId) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.Collection_Product).findOne({ _id: new objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    editProduct: (proId, product) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.Collection_Product).updateOne({ _id: new objectId(proId) }, { $set: { name: product.name, category: product.category, description: product.description } }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    }
}