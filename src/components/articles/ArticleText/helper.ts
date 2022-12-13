import uuid from 'react-native-uuid';
import { TextHighlight } from './types';

export const getTextHighlight = (text: string) => {
  if (!text) return [];

  const regexSplit = /(==[\s\S]+?==)/gim;
  const regexReplace = /(^==+|==+$)/gim;

  // split into an array (keep delimiter) by delimiter ==...==
  const lstTextRegex = text.split(regexSplit);
  // create an array of text highlight
  const lstTextHighlight: TextHighlight[] = lstTextRegex.map((item: string) => ({
    id: uuid.v4(),
    text: item.replace(regexReplace, ''),
    isHighlight: regexReplace.test(item),
  }));
  return lstTextHighlight;
};
