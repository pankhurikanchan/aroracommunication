import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

const DEFAULT_TITLE = 'Arora Mobile Hub | Smartphones, Laptops & Electronics in Bareilly';
const DEFAULT_DESC =
  'Shop 100% genuine smartphones, iPhones, Samsung, OnePlus, laptops, smartwatches, and accessories at Arora Mobile Hub, C-15 Ekta Nagar, Bareilly. Official brand warranties & express delivery.';

export const useSEO = ({ title, description, keywords, canonical }: SEOProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title
      ? `${title} | Arora Mobile Hub Bareilly`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || DEFAULT_DESC);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description || DEFAULT_DESC;
      document.head.appendChild(meta);
    }

    // 3. Update Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', formattedTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || DEFAULT_DESC);

    // 4. Update Meta Keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // 5. Update Canonical link if provided
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) {
        linkCanonical.setAttribute('href', canonical);
      }
    }
  }, [title, description, keywords, canonical]);
};
