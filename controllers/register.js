// register user in db

const registerUser = (req, res, db, bcrypt, saltRounds) =>{
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password, saltRounds)

  db('users').insert({
    name: name,
    email: email,
    password: hash
  })
  .returning('email')
  .then(email => res.json(email))
  .catch(err => res.status(400).json('unable to register (server)', err))
  
}  

module.exports = { 
  registerUser: registerUser
}