import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  buildBreadcrumbStructuredData,
  buildCanonicalUrl,
} from '../../utils/seo';

const Seo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  structuredData = [],
  breadcrumbs = [],
  twitterCard = 'summary_large_image',
}) => {
  const canonicalUrl = buildCanonicalUrl(path);
  const imageUrl = image ? absoluteUrl(image) : '';
  const robotsContent = noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large';
  const jsonLdItems = [];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      jsonLdItems.push(...structuredData.filter(Boolean));
    } else {
      jsonLdItems.push(structuredData);
    }
  }

  const breadcrumbJsonLd = buildBreadcrumbStructuredData(breadcrumbs);
  if (breadcrumbJsonLd) {
    jsonLdItems.push(breadcrumbJsonLd);
  }

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {jsonLdItems.map((item, index) => (
        <script key={`${canonicalUrl}-jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
