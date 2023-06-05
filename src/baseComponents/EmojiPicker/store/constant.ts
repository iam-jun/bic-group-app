import { Platform } from 'react-native';

export const EMOJI_SIZE = 30;
export const EMOJI_GUTTER = 7;
export const SECTION_HEADER_HEIGHT = 28;
export const SECTION_MARGIN = 15;
export const SCROLLVIEW_NATIVE_ID = 'emojiPicker';
export const ON_END_REACHED_THRESHOLD = Platform.OS === 'ios' ? 0 : 1;

export const CATEGORIES_ICONS = {
  recent: 'iconCatRecent',
  'smileys-emotion': 'iconCatEmoticon',
  'people-body': 'iconCatPeople',
  'animals-nature': 'iconCatAnimal',
  'food-drink': 'iconCatFood',
  'travel-places': 'iconCatTravel',
  activities: 'iconCatActivity',
  objects: 'iconCatObject',
  symbols: 'iconCatSymbol',
  flags: 'iconCatFlag',
  custom: 'iconCatCustom',
};
