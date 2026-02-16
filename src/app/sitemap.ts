import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://airea.ai';

  // Static pages
  const staticPages = [
    '',
    '/pricing',
    '/login',
    '/signup',
    '/contact',
    '/privacy',
    '/terms',
    '/fair-housing',
  ];

  const staticSitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In production, you would also fetch active listings and add them
  // const listings = await fetchActiveListings();
  // const listingSitemap = listings.map(listing => ({
  //   url: `${baseUrl}/listings/${listing.id}`,
  //   lastModified: listing.updated_at,
  //   changeFrequency: 'daily' as const,
  //   priority: 0.6,
  // }));

  return staticSitemap;
}
