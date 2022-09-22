// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import Fuse from 'fuse.js';
import { useTheme } from '@react-navigation/native';

import { useDeviceOrientation, useDimensions } from '@react-native-community/hooks';
import EmojiPickerComponent from './emoji_picker';
import {
  CategoryNames, EmojiIndicesByAlias, EmojiIndicesByCategory, Emojis,
} from '../Emoji/emojis';
import custom_emojis from '~/resources/custom_emojis';

function getSkin(emoji) {
  if (emoji?.skin_variations) {
    return 'default';
  }
  if (emoji?.skins) {
    return emoji.skins && emoji.skins[0];
  }
  return null;
}

function fillEmoji(indice) {
  const emoji = Emojis[indice];
  if (!emoji) {
    return null;
  }

  return {
    name: emoji?.short_name ? emoji.short_name : emoji.name,
    aliases: emoji?.short_name ? emoji.short_name : [],
  };
}

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

const icons = {
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

export const selectEmojisBySection = () => {
  const skinTone = 'default';
  const customEmojiItems = Object.keys(custom_emojis).map((key) => custom_emojis[key]);
  const recentEmojis = [];
  // for (const [key] of customEmojis) {
  //   customEmojiItems.push({
  //     name: key,
  //   });
  // }

  // const categoryToI18n = {};
  // CategoryNames.forEach((name) => {
  //   categoryToI18n[name] = {
  //     id: CategoryTranslations.get(name),
  //     // defaultMessage: CategoryMessage.get(name),
  //     defaultMessage: name,
  //     icon: icons[name],
  //   };
  // });

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
      icon: icons[category],
      data,
    };

    return section;
  });

  return emoticons;
};

const EmojiPicker = (ownProps) => {
  const theme = useTheme();
  const emojisBySection = selectEmojisBySection();
  const emojis = selectEmojisByName();
  const dimension = useDimensions();
  const orientation = useDeviceOrientation();
  const options = {
    shouldSort: false,
    ignoreLocation: true,
    includeMatches: true,
    findAllMatches: true,
  };

  const list = emojis.length ? emojis : [];
  const fuse = new Fuse(list, options);

  const props = {
    ...ownProps,
    fuse,
    theme,
    emojis,
    emojisBySection,
    deviceWidth: dimension.screen.width,
    isLandscape: orientation.landscape,
    customEmojisEnabled: true,
    // customEmojiPage: state.views.emoji.emojiPickerCustomPage,
  };
  return <EmojiPickerComponent {...props} />;
};

export default EmojiPicker;
