import {
  CategoryNames, EmojiIndicesByAlias, EmojiIndicesByCategory, Emojis,
} from '~/baseComponents/Emoji/emojis';
import custom_emojis from '~/resources/custom_emojis';
import { compareEmojis } from '~/utils/emojiUtils';
import {
  CATEGORIES_ICONS, EMOJI_GUTTER, EMOJI_SIZE, SECTION_HEADER_HEIGHT, SECTION_MARGIN,
} from './constant';

export const getRenderableEmojis = (emojis: any[], deviceWidth: number) => {
  const numberOfColumns = getNumberOfColumns(deviceWidth);

  const nextEmojis = emojis.map((section) => {
    const data = [];
    let row = {
      key: `${section.id}-0`,
      items: [],
    };

    section.data.forEach((emoji, index) => {
      if (index % numberOfColumns === 0 && index !== 0) {
        data.push(row);
        row = {
          key: `${section.key}-${index}`,
          items: [],
        };
      }

      row.items.push(emoji);
    });

    if (row.items.length) {
      if (row.items.length < numberOfColumns) {
        // push some empty items to make sure flexbox can justfiy content correctly
        const emptyEmojis = new Array(numberOfColumns - row.items.length);
        row.items.push(...emptyEmojis);
      }

      data.push(row);
    }

    return {
      ...section,
      data,
    };
  });

  return nextEmojis;
};

const getNumberOfColumns = (deviceWidth) => {
  // [TO-DO] handle horizontal orientation
  // const shorten = dimension.isPhoneWithInsets && props.isLandscape ? 4 : 2;
  const shorten = 2;
  return Math.floor(
    Number((
      (deviceWidth - (SECTION_MARGIN * shorten))
        / ((EMOJI_SIZE + 7) + (EMOJI_GUTTER * shorten))
    )),
  );
};

export const getSkin = (emoji:any) => {
  if (emoji?.skin_variations) {
    return 'default';
  }
  if (emoji?.skins) {
    return emoji.skins && emoji.skins[0];
  }
  return null;
};

export const fillEmoji = (indice) => {
  const emoji = Emojis[indice];
  if (!emoji) {
    return null;
  }

  return {
    name: emoji?.short_name ? emoji.short_name : emoji.name,
    aliases: emoji?.short_name ? emoji.short_name : [],
  };
};

export const selectEmojisByName = () => {
  const skinTone = 'default';
  const emoticons = new Set();
  EmojiIndicesByAlias.forEach((value, key) => {
    const skin = getSkin(Emojis[key]);
    if (!skin || skin === skinTone) {
      emoticons.add(key);
    }
  });
  Object.keys(custom_emojis).forEach((key) => emoticons.add(key));
  return Array.from(emoticons);
};

export const selectEmojisBySection = (recentEmojis = []) => {
  const skinTone = 'default';
  const customEmojiItems = Object.keys(custom_emojis).map((key) => custom_emojis[key]);

  const recentItems = recentEmojis.map((emoji) => ({ name: emoji }));
  const filteredCategories = CategoryNames.filter((category) => category !== 'recent' || recentItems.length > 0);
  const emoticons = filteredCategories.map((category) => {
    const items = EmojiIndicesByCategory.get(skinTone).get(category).map(fillEmoji);
    const data = items;
    if (category === 'custom') {
      data.push(...customEmojiItems);
    } else if (category === 'recent') {
      data.push(...recentItems);
    }
    const section = {
      // ...categoryToI18n[category],
      id: category,
      icon: CATEGORIES_ICONS[category],
      data,
    };

    return section;
  });

  return emoticons;
};

export const searchEmojis = (fuse: any, searchTerm: string) => {
  // if (!searchTerm) {
  //   return cancelSearch();
  // }

  const searchTermLowerCase = searchTerm.toLowerCase();

  if (!searchTerm) {
    return [];
  }

  const sorter = (a, b) => compareEmojis(a, b, searchTermLowerCase);
  const fuzz = fuse.search(searchTermLowerCase);
  const results = fuzz.reduce((values, r) => {
    const v = r.matches[0]?.value;
    if (v) {
      values.push(v);
    }

    return values;
  }, []);

  const data = results.sort(sorter);

  return data;
};

export const measureEmojiSections = (emojiSections) => {
  let lastOffset = 0;
  return emojiSections.map((section) => {
    const start = lastOffset;
    const nextOffset = (section.data.length * ((EMOJI_SIZE + 7) + (EMOJI_GUTTER * 2))) + SECTION_HEADER_HEIGHT;
    lastOffset += nextOffset;

    return start;
  });
};

export function filterEmojiSearchInput(searchText) {
  return searchText.toLowerCase().replace(/^:|:$/g, '');
}
