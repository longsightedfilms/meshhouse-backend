import { getFromDB, runQueryDB } from './database.mjs'
import { logger } from './logger.mjs'

/**
 * Get all categories from DB
 *
 * @return {Array.<Object>} Array of all categories
 */
export async function getCategories() {
  let categories = await getFromDB(`SELECT id, parentId, categorySlug, categoryName, icon,
  (SELECT COUNT(models.name) FROM 'Models'
  WHERE models.categoryId = Categories.id) AS modelsCount
  FROM 'Categories' ORDER BY categorySlug ASC`)
  categories = categories.map((category) => {
    category.categoryName = JSON.parse(category.categoryName)
    return category
  })

  return categories
}
/**
 * Get single category
 *
 * @param {String} slug Category slug
 * @return {Object} Category object
 */
export async function getCategorySingle(args) {
  const { slug } = args
  logger.info(`Request to DB started with arguments: Category - ${slug}`)
  let category = await getFromDB(`SELECT id, parentId, categorySlug, categoryName
  FROM 'Categories'
  WHERE categorySlug = '${slug}'`)
  category = category.map((item) => {
    item.categoryName = JSON.parse(item.categoryName)
    return item
  })
  return category[0]
}
/**
 * Add new category in DB
 * @param {Array.<string | object>} args - Arguments (slug - string, name - JSON)
 * @return {Boolean} - result
 */
export async function addCategory(args) {
  let { slug, name } = args
  name = JSON.stringify(name)

  let category = await getFromDB(`SELECT * FROM 'Categories' WHERE categorySlug = '${slug}'`)
  if (category.length !== 0) {
    let result = await runQueryDB(`INSERT INTO 'Categories' VALUES(NULL, NULL, $slug, $name, 0)`, [slug, name])

    return result
  } else {
    return Promise.reject('Category already exists')
  }
}
export async function editCategory(args) {
  let { slug, name, id } = args
  name = JSON.stringify(name)

  const result = await runQueryDB(`UPDATE 'Categories' SET categoryName = $name, categorySlug = $slug WHERE id = $id`, [name, slug, id])

  return result
}
/**
 * Remove category from DB
 * @param {Array.<string>} args - Arguments (slug - string)
 * @return {Boolean} - result
 */
export async function deleteCategory(args) {
  let slug = args[0]
  let result = await runQueryDB(`DELETE FROM 'Categories' WHERE categorySlug = '$slug'`, [slug])
  let update = await runQueryDB(`UPDATE 'Models' SET category = '' WHERE category = '$slug'`, [slug])
  return result & update
}
