const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'Rav',
    password: '',
    database: 'jwt'
  }
});

const app = express();
app.use(cors())

app.use(bodyParser.json()); 


//-------------------------------------------------------------------------
app.get('/', (req, res) => {res.send('working')})
//-------------------------------------------------------------------------
app.post('/register', (req, res) => {register.registerUser(req, res, db, bcrypt, saltRounds)})
//-------------------------------------------------------------------------
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
//-------------------------------------------------------------------------
app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})