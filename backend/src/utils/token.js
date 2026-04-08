// Generate Access + Refresh Tokens with jti

const jwt = require('jsonwebtoken')
const {v4:uuidv4} = require('uuid')

const generateToken = (user) =>{
  const jti = uuidv4();

  const accessToken = jwt.sign(
    {
      id:user._id,
      username:user.username,
      jti,
    },process.env.JWT_SECRET,{expiresIn:'15m'}
  )

  const refreshToken = jwt.sign(
    {
      id:user._id,
      jti
    },process.env.JWT_REFRESH,{expiresIn:'7d'}
  )

  return {accessToken,refreshToken,jti}
}

module.exports = generateToken