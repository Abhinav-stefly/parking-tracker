const express = require('express');
const cors = require('cors');
const connectDb = require('./db');
const dotenv = require('dotenv');

dotenv.config({path : './config/.env'});
const app = express();

connectDb()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

app.get('/', (req, res)=>{
  res.send("API is running...")
})

app.use('/api/v1/users',require('./routes/users'))
const PORT = process.env.PORT

app.listen(PORT, ()=>{ console.log(`Server is running  ${PORT}`)
} )