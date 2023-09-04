export enum TrackingEvent {
  CONTENT_READ = 'Content Read',
  CONTENT_PUBLISHED = 'Content Published',
  SCHEDULE = 'Schedule',
  EMOJI_REACTED = 'Emoji Reacted',
  COMMENT_ADDED = 'Comment Added',
  IMPORTANT_MARKED = 'Important Marked',
  PERSONAL_PRIVACY_CHANGED = 'Personal Privacy Changed',
  INVITATION_PRIVACY_CHANGED = 'Invitation Privacy Changed',
  AVATAR_CHANGED = 'Avatar Changed',
  AVATAR_PROCESS_DROPPED = 'Avatar Process Dropped',
  COVER_PHOTO_CHANGED = 'Cover Photo Changed',
  COMMUNITY_NOTI_CHANGED = 'Community Noti Changed',
  GROUP_NOTI_CHANGED = 'Group Noti Changed',
  ALL_NOTI_VIEWED = 'All Noti Viewed',
  UNREAD_NOTI_VIEWED = 'Unread Noti Viewed',
  MENTION_NOTI_VIEWED = 'Mention Noti Viewed',
  IMPORTANT_NOTI_VIEWED = 'Important Noti Viewed',
  SPECIFIC_NOTI_CHANGED = 'Specific Noti Changed',
}

export enum TrackingEventContentReadAction {
  BODY = 'body',
  SEE_MORE = 'see_more',
  CONTENT_HEADER = 'content_header',
  COMMENT = 'comment',
  SERIES_ITEM = 'series_item',
  NOTIFICATION = 'notification',
}
