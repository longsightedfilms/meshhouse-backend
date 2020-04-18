import * as jwt from 'jsonwebtoken'
import config from '../../config.json'

export default function (token) {
  try {
    const result = jwt.verify(token, config.auth_secret, {
      maxAge: '6h'
    })
    return Promise.resolve(true)
  } catch(err) {
    return Promise.reject(false)
  }
}
