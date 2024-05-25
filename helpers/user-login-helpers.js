var collection = require('../config/db_collections')
var bcrypt = require('bcrypt')
var db = require('../config/db_connection')
var collection = require('../config/db_collections')

var promise = require('promise')

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
            bcrypt.hash(userdata.password, 10).then((password) => {
                userdata.password = password
                console.log(userdata.password)
                db.get().collection(collection.Collection_User).findOne({ email: userdata.email }).then((accept, err) => {
                    if (accept) {
                        resolve('Already Exist')
                    }
                    else {
                        db.get().collection(collection.Collection_User).insertOne(userdata).then((data) => {
                            resolve(data)
                        })
                    }
                })
            })

        })

    }
}