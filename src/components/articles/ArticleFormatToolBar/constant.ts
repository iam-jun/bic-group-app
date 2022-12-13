import { IconType } from '~/resources/icons';

export type HeadingType = 'h1' | 'h2' | 'h3' | 'unstyled';
export type AlignType = 'left' | 'right' | 'center' | 'justify';
export type MarkType = 'bold' | 'italic' | 'underline' | 'strikethrough';
export type ListType = 'ol' | 'ul';

export const Headings: {[x: string]: IconType} = {
  unstyled: 'Text',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
};

export const Alignments: {[x: string]: IconType} = {
  left: 'AlignLeft',
  right: 'AlignRight',
  center: 'AlignCenter',
  justify: 'AlignJustify',
};

export const MarkUps: {[x: string]: IconType} = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strikethrough: 'Strikethrough',
};

export const Lists: {[x: string]: IconType} = {
  ol: 'ListOl',
  ul: 'ListUl',
};
