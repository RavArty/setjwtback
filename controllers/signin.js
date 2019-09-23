const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  console.log(email)
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'password').from('users')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
        return res.json(data[0])
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}