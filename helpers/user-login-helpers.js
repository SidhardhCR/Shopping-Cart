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
        return new promise((resolve, reject) => {
            db.get().collection(collection.Collection_Cart).findOne({ user: new ObjectId(userId) }).then((response) => {
                console.log(response)
                if (response) {
                    db.get().collection(collection.Collection_Cart).updateOne({ user: new ObjectId(userId) }, {
                        $push: { product: new ObjectId(proId) }
                    }).then((response) => {
                        resolve(response)
                    })

                }
                else {
                    let cartObj = {
                        user: new ObjectId(userId),
                        product: [
                            new ObjectId(proId)
                        ]
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
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.Collection_Product,
                        let: { proList: '$product' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$proList']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
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
    }
}