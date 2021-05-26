const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')

//get constants from config file
const PORT = config.get('port') || 5000
const uri =  config.get('mongoUri') || ''

//middlewares
app.use(express.json({
    extended : true
}))
//routes
app.use('/api/auth', require('./routes/auth.routes'))

//Connect to DB and start server
async function startServer() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(5000,()=>{
            console.log(`App has been started on  ${PORT} `)
        })
    } catch (e){
        if (e) throw e
        process.exit(1)
    }
}
startServer().then(r => console.log('Success'))
