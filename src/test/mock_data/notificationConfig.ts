export const mockConfigData = [{
  name: 'generic', title: 'Allow notifications', enable: true, order: 1,
}, {
  name: 'comment',
  title: 'Comments',
  subtitle: 'These are notifications for when someone comments on your post or replies to your comment',
  enable: true,
  channels: { inApp: true, push: true },
  order: 2,
}, {
  name: 'mentions',
  title: 'Mentions',
  subtitle: 'These are notifications for when someone mentions you in a post or comment',
  enable: true,
  order: 3,
  child: [{
    name: 'post_mentions',
    title: 'Mentions in a post',
    channels: { inApp: true, push: true },
    order: 1,
  }, {
    name: 'comment_mentions',
    title: 'Mentions in a comment',
    channels: { inApp: true, push: true },
    order: 2,
  }],
}, {
  name: 'reaction',
  title: 'Reactions',
  subtitle: 'These are notifications for when someone react to your posts or comments',
  enable: true,
  channels: { inApp: true, push: false },
  order: 4,
}, {
  name: 'email',
  title: 'Email notifications',
  subtitle: "Essential system notifications can't be disabled for operational and security purposes",
  enable: true,
  order: 5,
  child: [{
    name: 'email_important_content',
    title: 'Important content',
    subtitle: 'Someone posts a series, article, or single post and marks it as important',
    enable: true,
    order: 1,
  }, {
    name: 'email_content_mentions',
    title: 'Mentions in a post',
    subtitle: 'Someone mentions you in a post',
    enable: true,
    order: 2,
  }],
}];
