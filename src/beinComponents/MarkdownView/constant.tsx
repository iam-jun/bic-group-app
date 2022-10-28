export type MarkdownType =
  // core
  | 'normalize'
  | 'block'
  | 'inline'
  | 'linkify'
  | 'replacements'
  | 'smartquotes'
  // block
  | 'table'
  | 'code'
  | 'fence'
  | 'blockquote'
  | 'hr'
  | 'list'
  | 'html_block'
  | 'heading'
  | 'lheading'
  | 'paragraph' // dangerous
  // inline
  | 'text'
  | 'newline'
  | 'escape'
  | 'backticks'
  | 'strikethrough'
  | 'emphasis'
  | 'link'
  | 'image'
  | 'autolink'
  | 'html_inline'
  | 'entity'
  | 'text_collapse'
  | 'reference'
  | 'balance_pairs';

export const blacklistDefault = ['image'];

export const blacklistLimit = [
  // 'normalize',
  // 'block',
  // 'inline',
  // 'linkify',
  // 'replacements',
  // 'smartquotes',
  'table',
  // 'code',
  // 'fence',
  'blockquote',
  'hr',
  'list',
  // 'html_block',
  'heading',
  'lheading',
  // 'text',
  // 'newline',
  // 'escape',
  // 'backticks',
  // 'strikethrough',
  // 'emphasis',
  'link',
  'image',
  // 'autolink',
  'html_inline',
  // 'entity',
  // 'text_collapse',
  // 'reference',
  // 'balance_pairs',
];
