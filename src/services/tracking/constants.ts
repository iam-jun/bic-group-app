export enum TrackingEvent {
  CONTENT_READ = 'Content Read',
  CONTENT_PUBLISHED = 'Content Published',
  SCHEDULE = 'Schedule',
  EMOJI_REACTED = 'Emoji Reacted',
  COMMENT_ADDED = 'Comment Added',
  IMPORTANT_MARKED = 'Important Marked',
}

export enum TrackingEventContentReadAction {
  BODY = 'body',
  SEE_MORE = 'see_more',
  CONTENT_HEADER = 'content_header',
  COMMENT = 'comment',
  SERIES_ITEM = 'series_item',
  NOTIFICATION = 'notification',
}
