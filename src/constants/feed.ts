import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';

export const HEADER_CONTENT_FEED_FILTER = [
  { id: ContentFeed.ALL, text: 'home:title_feed_content_all' },
  { id: ContentFeed.POST, text: 'home:title_feed_content_posts' },
  { id: ContentFeed.ARTICLE, text: 'home:title_feed_content_articles' },
  { id: ContentFeed.SERIES, text: 'home:title_feed_content_series' },
];

export const HEADER_ATTRIBUTE_FEED_FILTER = [
  { id: AttributeFeed.ALL, text: 'home:title_feed_attritube_all' },
  { id: AttributeFeed.IMPORTANT, text: 'home:title_feed_attritube_important' },
  { id: AttributeFeed.SAVED, text: 'home:title_feed_attritube_saved' },
];
