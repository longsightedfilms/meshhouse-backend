import * as jwt from 'jsonwebtoken'
import * as argon2 from 'argon2'
import { randomBytes } from 'crypto'
import config from '../config.json'

import User from './models/user.mjs'
import { logger } from './logger.mjs'

import isAuth from './middlewares/isAuth.mjs'

/**
 * Login user into admin page
 * @param {Array.<any>} args (email, password)
 */
export async function Login(args) {
  const email = args.email
  const password = args.password

  console.log(Object.keys(args))
  const user = await User.getUser(email)
  if (typeof user !== 'string') {
    const correctPassword = await argon2.verify(user.password, password)
    if (!correctPassword) {
      return Promise.reject('Incorrect password')
    }
  } else {
    return user
  }

  return {
    user: {
      email: user.email,
      name: user.name,
      status: user.status
    },
    token: this.generateToken(user),
  }
}
/**
 * Register user on site
 * @param args (email, password, name)
 */
export async function SignUp(args) {
  const { email, password, name } = args
  const salt = randomBytes(32)
  const passwordHashed = await argon2.hash(password, { salt })

  const user = await User.addUser({
    email: email,
    password: passwordHashed,
    name: name
  })

  const token = this.generateToken(user)
  return {
    user: {
      email: user.email,
      name: user.name,
      status: user.status
    },
    token: token
  }
}
/**
 * Check authenticated user for needed status
 * @param args (email, privileges)
 */
export async function  checkUserPrivileges(args) {
  const {email, token, privileges} = args
  if (isAuth(token)) {
    const user = await User.getUser(email)
    if (typeof user !== 'string') {
      if (privileges === user.status) {
        return Promise.resolve('accepted')
      } else {
        return Promise.reject('failed')
      }
    } else {
      return user
    }
  } else {
    return Promise.reject('Token not valid')
  }
}
/**
 * Generates JWT token for authenticated actions
 * @param user User data
 */
function generateToken(user) {
  const data =  {
    id: user.id,
    name: user.name,
    email: user.email
  };
  const signature = config.auth_secret
  const expiration = '6h'

  return jwt.sign({ data, }, signature, { expiresIn: expiration })
}
