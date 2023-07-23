require('dotenv').config()
const app = require('./app.js');
const { databaseConnect } = require('./configs/database.js');
const port = process.env.PORT || 5000



app.listen(port , ()=>{
    console.log(`Server is running at http://127.0.0.1:${port}`);
    databaseConnect()
})