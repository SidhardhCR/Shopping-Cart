const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017/'
    const dbname = 'shopping'

    mongoClient.connect(url).then((client) => {

        state.db = client.db(dbname)
        console.log(state.db)
        done()
    }).catch((err) => {
        console.log(err)
        return done(err)
    })


}

module.exports.get = function () {
    return state.db
}