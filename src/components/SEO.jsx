import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

export const SITE_NAME = 'Trendkaro'
export const SITE_URL = 'https://silentadx.in'
export const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`
export const THEME_COLOR = '#2563eb'

function cleanUrl(value) {
  if (!value) {
    return ''
  }

  try {
    const parsedUrl = new URL(value, SITE_URL)
    parsedUrl.search = ''
    parsedUrl.hash = ''
    return parsedUrl.toString()
  } catch {
    return value
  }
}

function getAbsoluteUrl(path) {
  return cleanUrl(new URL(path || '/', SITE_URL).toString())
}

function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  structuredData,
  noIndex = false,
}) {
  const location = useLocation()
  const canonicalUrl = cleanUrl(url) || getAbsoluteUrl(location.pathname)
  const metaTitle = title || SITE_NAME
  const metaDescription =
    description ||
    'Discover the best affiliate deals on fashion, tech, trending products, and everyday finds from Trendkaro.'
  const metaImage = image || DEFAULT_IMAGE
  const jsonLdItems = Array.isArray(structuredData)
    ? structuredData.filter(Boolean)
    : [structuredData].filter(Boolean)

  return (
    <Helmet>
      <html lang="en" />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="theme-color" content={THEME_COLOR} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {jsonLdItems.map((item, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}

export default SEO
