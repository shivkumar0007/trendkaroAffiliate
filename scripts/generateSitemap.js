import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import admin from 'firebase-admin'
import categories from '../src/data/categories.js'

const SITE_URL = 'https://silentadx.in'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../public')
const sitemapPath = path.join(publicDir, 'sitemap.xml')

function parseServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'),
    )
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  }

  return null
}

function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return
  }

  const serviceAccount = parseServiceAccount()

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    })
    return
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toIsoDate(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString().slice(0, 10)
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10)
}

function createUrlEntry({ loc, lastmod, changefreq = 'weekly', priority = '0.7' }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

async function fetchProducts() {
  initializeFirebaseAdmin()

  const snapshot = await admin.firestore().collection('products').get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function generateSitemap() {
  const products = await fetchProducts()
  const today = new Date().toISOString().slice(0, 10)
  const categoryIds = new Set(categories.map((category) => category.id))

  for (const product of products) {
    if (product.category) {
      categoryIds.add(product.category)
    }
  }

  const entries = [
    createUrlEntry({
      loc: SITE_URL,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    }),
    ...Array.from(categoryIds).map((categoryId) =>
      createUrlEntry({
        loc: `${SITE_URL}/category/${encodeURIComponent(categoryId)}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8',
      }),
    ),
    ...products.map((product) =>
      createUrlEntry({
        loc: `${SITE_URL}/product/${encodeURIComponent(product.id)}`,
        lastmod: toIsoDate(product.updatedAt || product.createdAt),
        changefreq: 'weekly',
        priority: '0.7',
      }),
    ),
  ]

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.join('\n'),
    '</urlset>',
    '',
  ].join('\n')

  await mkdir(publicDir, { recursive: true })
  await writeFile(sitemapPath, sitemap, 'utf8')
  console.log(`Generated ${sitemapPath} with ${entries.length} URLs.`)
}

generateSitemap().catch((error) => {
  console.error('Failed to generate sitemap.xml')
  console.error(error)
  process.exitCode = 1
})
