import fs from 'fs'
import { PAGE_LIMIT } from '../constants.mjs'
import { getFromDB } from './database.mjs'
import { getCategories } from './categories.mjs'
import { logger } from './logger.mjs'

/**
 * @typedef {Object} Results
 * @property {Array.<Object>} models - Array of models
 * @property {Array.<Object>} categories - Array of categories
 */

/**
 * Get all models information from DB. Optional filter by category
 * @param {Array.<any>} args - Arguments
 * @return {Results} Query result
 */
export async function getModels(args) {
  const category = args.category
  const offset = args.page * PAGE_LIMIT
  const query = args.query

  logger.info(`Request to DB started with arguments: Category - ${category}, Offset - ${offset}, Query params - ${JSON.stringify(query)}`)

  let modelsQuery = `SELECT * FROM 'Models'`
  modelsQuery += dynamicQueryBuilder({ categoryId: category, ...query })
  modelsQuery += ` ORDER BY date DESC`
  modelsQuery += ` LIMIT 50 OFFSET ${offset}`

  let models = await getFromDB(modelsQuery)
  let categories = await getCategories()
  let allModels = await getFromDB(`SELECT * FROM 'Models'`)

  let result = {
    models: models,
    modelsLength: allModels.length,
    categories: categories
  }

  result.models = result.models.map((model) => {
    model.info = JSON.parse(model.info)
    model.links = JSON.parse(model.links)
    model.tags = JSON.parse(model.tags)
    model.images = JSON.parse(model.images)
    return model
  })
  logger.info(`Request to DB finished`)
  return result
}

/**
 * Get single model information from DB
 *
 * @param {Array.<string>} slug - Model slug
 * @return {Object} Model object
 */
export async function getSingleModel(args) {
  const slug = args[0]
  let model = await getFromDB(`SELECT * FROM 'Models' WHERE slug = '${slug}'`)
  model[0].info = JSON.parse(model[0].info)
  model[0].links = JSON.parse(model[0].links)
  model[0].tags = JSON.parse(model[0].tags)
  model[0].images = JSON.parse(model[0].images)
  return model
}

/**
 * Dynamic SQL query builder if user set filters
 * @param params - query object
 */
function dynamicQueryBuilder(params) {
  let query = ''
  let clause = ''
  const paramsEmpty = []

  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== 'all' && value !== 'none' && value !== null && value !== undefined) {
      paramsEmpty.push(true)
      if (key === 'name') {
        clause += `${key} LIKE '%${value}%' OR (SELECT tags from 'Models', json_each(tags)) LIKE '%${value}%'`
      } else if (key === 'dcc') {
        clause += `json_extract(value, '$.${key}') = '${value}'`
      } else if (key === 'categoryId') {
        clause += `${key} = ${value} OR ${key} IN (SELECT id FROM 'Categories' WHERE Categories.parentId IN (
          SELECT parentId FROM 'Categories' WHERE parentId = ${value})
        )`
      } else {
        clause += `${key} = '${value}'`
      }
      clause += ` AND `
    } else {
      paramsEmpty.push(false)
    }
  }
  clause = clause.substr(0, clause.length - 5)
  if(params.dcc !== '') {
    query = ', Models.info'
  }
  if (paramsEmpty.includes(true) !== false) {
    query += ' WHERE ' + clause
  }
  return query
}
