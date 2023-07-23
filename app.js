const express = require('express')
const app = express()
const cookie = require('cookie-parser')
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookie())
app.use(cors())


// ALL route
const router = require('./routes/productRoute');
const routeruser = require("./routes/userRoute")
const routeOrder = require('./routes/orderRoute')
app.use('/api/v1', router)
app.use('/api/v1', routeruser)
app.use('/api/v1', routeOrder)




app.use('*', (req, res) => {
    res.status(404).send({ message: '404 page not found' })
})


module.exports = app