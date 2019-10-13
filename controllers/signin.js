const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({host: '127.0.0.1'});

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days'});
};
const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  const { email } = user;
  const token = signToken(email);
  return setToken(token, email)
    .then(() => {
      return { success: 'true', userEmail: email, token }
    })
    .catch(console.log);
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'password').from('users')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
        return data[0]
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => err)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  //in case jwt token send in authorization token
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
    .then(data => data.email ? createSession(data) : Promise.reject(data))
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err));
}

module.exports = {
  signinAuthentication: signinAuthentication
}