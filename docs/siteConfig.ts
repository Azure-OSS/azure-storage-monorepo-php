export const siteUrl = 'https://azure-oss.github.io';
export const baseUrl = '/';

export const apiReferencePath = new URL(
  'api/',
  new URL(baseUrl, 'https://docusaurus.local'),
).pathname;
