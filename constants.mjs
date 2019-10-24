import path from 'path'

const moduleURL = new URL(import.meta.url)
/**
 * @constant {string} __dirname - Current root directory (because in ES2015 modules native __dirname not working)
 */
export const __dirname = path.dirname(moduleURL.pathname)
/**
 * @constant {number} PAGE_LIMIT - SQL limit items per page
 */
export const PAGE_LIMIT = 50