import path from 'path'
import sqlite3 from 'sqlite3'
import { __dirname } from '../constants.mjs'
import { logger } from './logger.mjs'

const dbPath = path.normalize(`./db/meshhouse.sqlite3`)
const db = new sqlite3.cached.Database(path.resolve(dbPath))

export async function getFromDB(query) {
  return new Promise((resolve, reject) => {
    db.all(query, ((err, rows) => {
      if (err) {
        logger.error(`Error has occured: ${err}`)
        reject(err)
      } else {
        resolve(rows)
      }
    }))
  })
}

export async function runQueryDB(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, ((err) => {
      if (err) {
        logger.error(`Error has occured: ${err}`)
        reject(err)
      } else {
        resolve(true)
      }
    }))
  })
}
