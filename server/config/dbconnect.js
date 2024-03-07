const { default : mongoose } = require('mongoose')

const dbConnect = async() => {
    try {

        const conn = await mongoose.connect(process.env.MONGOODB_URI)
        if(conn.connection.readyState == 1) console.log('DB connectiiion is successfully')
        else console.log('DB is connecting')

    } catch (error) {
        console.log('DB connection is failed')
        throw new Error(error)
    }
}

module.exports = dbConnect