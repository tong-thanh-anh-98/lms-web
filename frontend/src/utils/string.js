import striptags from 'striptags';

export function stripHtml(htmlString = '') {
  return striptags(htmlString);
}