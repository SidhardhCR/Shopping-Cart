var collection = require('../config/db_collections')
var bcrypt = require('bcrypt')
var db = require('../config/db_connection')
var collection = require('../config/db_collections')

var promise = require('promise')
const { ObjectId } = require('mongodb')
const { response } = require('../app')

module.exports = {
    doLogin: (userdata) => {

        return new promise((resolve, reject) => {

            let response = {}

            db.get().collection(collection.Collection_User).findOne({ email: userdata.email }).then((user) => {
                if (user) {

                    bcrypt.compare(userdata.password, user.password).then((status) => {
                        if (status) {
                            response.user = user
                            response.status = true
                            resolve(response)
                        }
                        else {
                            response.status = false
                            resolve(response)
                        }
                    })
                } else {
                    response.status = false
                    resolve(response)
                }
            })
        })
    },

    doSignup: (userdata) => {
        return new promise((resolve, reject) => {
            let response = {}
            bcrypt.hash(userdata.password, 10).then((password) => {
                userdata.password = password
                console.log(userdata.password)
                db.get().collection(collection.Collection_User).findOne({ email: userdata.email }).then((accept, err) => {
                    if (accept) {
                        resolve('Already Exist')
                    }
                    else {
                        db.get().collection(collection.Collection_User).insertOne(userdata).then((data) => {
                            db.get().collection(collection.Collection_User).findOne({ _id: data.insertedId }).then((user) => {

                                response.status = true
                                response.user = user
                                resolve(response)
                            })

                        })
                    }
                })
            })

        })

    },
    addToCart: (proId, userId) => {
        let proObj = {
            item: new ObjectId(proId),
            quantity: 1
        }
        return new promise((resolve, reject) => {
            db.get().collection(collection.Collection_Cart).findOne({ user: new ObjectId(userId) }).then((UserCart) => {
                console.log(UserCart)
                if (UserCart) {
                    db.get().collection(collection.Collection_Cart).findOne({ 'product.item': new ObjectId(proId) }).then((proExist) => {
                        if (proExist) {
                            db.get().collection(collection.Collection_Cart).updateOne({ 'product.item': new ObjectId(proId), user: new ObjectId(userId) }, {
                                $inc: { 'product.$.quantity': 1 }
                            }).then((response) => {
                                console.log(response)
                                resolve(response)
                            })
                        } else {
                            db.get().collection(collection.Collection_Cart).updateOne({ user: new ObjectId(userId) }, {
                                $push: { product: proObj }
                            }).then((response) => {
                                resolve(response)
                            })
                        }

                    })



                }
                else {
                    let cartObj = {
                        user: new ObjectId(userId),
                        product: [proObj]
                    }
                    db.get().collection(collection.Collection_Cart).insertOne(cartObj).then((response) => {
                        resolve(response)
                    })
                }
            })
        })

    },
    getCartProducts: (userId) => {
        return new promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.Collection_Cart).aggregate([
                {
                    $match: {
                        user: new ObjectId(userId)
                    }
                },
                {
                    $unwind: {
                        path: "$product"
                    }
                },
                {
                    $project: {
                        item: "$product.item",
                        quantity: "$product.quantity"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'result'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        result: {
                            $arrayElemAt: ["$result", 0]
                        }
                    }
                }
            ]).toArray()
            console.log(cartItems)
            resolve(cartItems)
        })
    },
    deleteCartProduct: (proId, userId) => {
        return new promise((resolve, reject) => {
            console.log('hio')
            db.get().collection(collection.Collection_Cart).updateOne({ user: new ObjectId(userId) }, {
                $pull: { product: new ObjectId(proId) }
            }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    getCount: (userId) => {
        let count = 0
        return new promise(async (resolve, reject) => {
            let Cart = await db.get().collection(collection.Collection_Cart).findOne({ user: new ObjectId(userId) })
            if (Cart) {
                count = Cart.product.length
                resolve(count)
            }
            else {
                resolve(count)
            }
        })
    },
    changeQuantity: (details) => {
        details.count = parseInt(details.count)
        return new promise((resolve, reject) => {
            db.get().collection(collection.Collection_Cart).findOne({ _id: new ObjectId(details.cart) }).then((UserCart) => {

                if (UserCart) {
                    db.get().collection(collection.Collection_Cart).findOne({ 'product.item': new ObjectId(details.product) }).then((proExist) => {

                        if (proExist) {
                            db.get().collection(collection.Collection_Cart).updateOne({ 'product.item': new ObjectId(details.product), _id: new ObjectId(details.cart) }, {
                                $inc: { 'product.$.quantity': details.count }
                            }).then((response) => {

                                let quantity = db.get().collection(collection.Collection_Cart).aggregate([
                                    {
                                        $match: {
                                            _id: new ObjectId(details.cart)
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$product"
                                        }
                                    },
                                    {
                                        $project: {
                                            item: "$product.item",
                                            quantity: "$product.quantity"
                                        }
                                    },
                                    {
                                        $match: {
                                            item: new ObjectId(details.product)
                                        }
                                    },
                                    {
                                        $project: {
                                            quantity: 1
                                        }
                                    }
                                ]).toArray()
                                console.log(quantity)
                                resolve(quantity)
                            })
                        }

                    })



                }
            })
        })
    }
}