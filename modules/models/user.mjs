import { getFromDB, runQueryDB } from '../database.mjs'

export default class User {
  /**
   * Get user info from database
   * @param email User email
   */
  static async getUser(email) {
    console.log(email)
    const user = await getFromDB(`SELECT * FROM 'Users' WHERE email = '${email}'`)
    if (user.length === 0) {
      return 'User not found'
    } else {
      return user
    }
  }
  /**
   * Add user to database
   * @param data User data (email, password, name)
   */
  static async addUser(data) {
    const { email, password, name } = data
    const status = 'normal'

    if (typeof this.getUser(email) === 'string') {
      const result = await runQueryDB(`INSERT INTO 'Users' VALUES(NULL, $email, $password, $name, $status)`, [email, password, name, status])
      return result
    } else {
      return Promise.reject('User already exists')
    }
  }
}
