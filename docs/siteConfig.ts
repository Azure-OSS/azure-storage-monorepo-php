export const siteUrl = 'https://php-oss-for-azure.github.io';
export const baseUrl = '/';

export const apiReferencePath = new URL(
  'api/',
  new URL(baseUrl, 'https://docusaurus.local'),
).pathname;
