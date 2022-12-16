export enum EditArticleErrorType {
  SERIES_DENIED = 'SERIES_DENIED',
  GROUPS_DENIED = 'GROUPS_DENIED',
  TAGS_DENIED = 'TAGS_DENIED',
}

export const EMPTY_ARTICLE_CONTENT = [{ type: 'p', children: [{ text: '' }] }];
