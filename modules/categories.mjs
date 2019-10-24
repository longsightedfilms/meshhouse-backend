import { getFromDB, runQueryDB } from './database.mjs'

/**
 * Get all categories from DB
 * 
 * @return {Array.<Object>} Array of all categories
 */
export async function getCategories() {
  let categories = await getFromDB(`SELECT id, categorySlug, categoryName,
  (SELECT COUNT(models.name) FROM 'Models'
  WHERE models.category = Categories.categorySlug) AS modelsCount
  FROM 'Categories' ORDER BY categorySlug ASC`)
  categories = categories.map((category) => {
    category.categoryName = JSON.parse(category.categoryName)
    return category
  })

  return categories
}
/**
 * Add new category in DB
 * @param {Array.<string | object>} args - Arguments (slug - string, name - JSON)
 * @return {Boolean} - result
 */
export async function addCategory(args) {
  let slug = args[0]
  let name = JSON.stringify(args[1])

  let category = await getFromDB(`SELECT * FROM 'Categories' WHERE categorySlug = '${slug}'`)
  if (category.length !== 0) {
    let result = await runQueryDB(`INSERT INTO 'Categories' VALUES(NULL, $slug, $name, 0)`, [slug, name])

    return result
  } else {
    return Promise.reject('Category already exists')
  }
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