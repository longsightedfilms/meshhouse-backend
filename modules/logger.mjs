import winston from 'winston'
import { __dirname } from '../constants.mjs'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'meshhouse-api' },
  transports: [
    new winston.transports.File({ filename: `${__dirname}/logs/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${__dirname}/logs/logs.log`, level: 'info' }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}[${info.service}]: ${info.message}`)
      )
    })
  ]
})