const { MongoClient } = require('mongodb')
const env =require('dotenv').config() 
// env
 
let dbConnection
let uri=process.env.MONGODB_URI
 

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then((client) => {
                dbConnection = client.db()
              
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection

}