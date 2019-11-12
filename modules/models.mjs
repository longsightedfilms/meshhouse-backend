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

  logger.info(`Request to DB started with arguments: Category - ${category}, Offset - ${offset}`)

  let modelsQuery = `SELECT * FROM 'Models'`
  if (category != undefined) {
    modelsQuery += ` WHERE category = '${category}'`
  }
  modelsQuery += ` ORDER BY date DESC`
  modelsQuery += ` LIMIT 50 OFFSET ${offset}`

  let models = await getFromDB(modelsQuery)
  let categories = await getCategories()

  let result = {
    models: models,
    categories: categories
  }

  result.models = result.models.map((model) => {
    model.variations = JSON.parse(model.variations)
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
  model[0].variations = JSON.parse(model[0].variations)
  return model
}