export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/private/',
          '/api/',
          '/account-deletion/',
        ],
      },
    ],
    sitemap: 'https://pitchside.ai/sitemap.xml',
  };
}