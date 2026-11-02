const SITE_URL = 'https://nonprofits.athman3.com/'

/**
 * Keep the machine-readable directory in sync with the displayed search results.
 * @param {Object} props - Component props.
 * @param {Object[]} props.services - Services in their displayed order.
 */
export function StructuredData({ services }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        name: 'Awesome Free Nonprofits',
        url: SITE_URL,
        inLanguage: 'en',
      },
      {
        '@type': 'CollectionPage',
        '@id': SITE_URL,
        url: SITE_URL,
        name: 'Awesome Free Nonprofits',
        description: 'Free and discounted software, services, and resources for nonprofit organizations.',
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: services.length,
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Thing',
              name: service.name,
              description: [service.about, service.offer].filter(Boolean).join(' '),
              url: service.url,
            },
          })),
        },
      },
    ],
  }
  // Escape HTML delimiters so descriptions cannot close the JSON-LD script.
  const jsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
}
