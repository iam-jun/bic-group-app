// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import Fuse from 'fuse.js';
import { useTheme } from '@react-navigation/native';

import { useDeviceOrientation, useDimensions } from '@react-native-community/hooks';
import EmojiPickerComponent from './emoji_picker';
import {
  CategoryMessage,
  CategoryNames, CategoryTranslations, EmojiIndicesByAlias, EmojiIndicesByCategory, Emojis,
} from '../Emoji/emojis';

function getSkin(emoji) {
  if ('skin_variations' in emoji) {
    return 'default';
  }
  if ('skins' in emoji) {
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
    name: 'short_name' in emoji ? emoji.short_name : emoji.name,
    aliases: 'short_names' in emoji ? emoji.short_names : [],
  };
}

export const selectEmojisByName = () => {
  const skinTone = 'default';
  const emoticons = new Set();
  EmojiIndicesByAlias.entries((key, index) => {
    const skin = getSkin(Emojis[index]);
    if (!skin || skin === skinTone) {
      emoticons.add(key);
    }
  });

  // for (const [key] of customEmojis.entries()) {
  //   emoticons.add(key);
  // }
  return Array.from(emoticons);
};

const icons = {
  recent: 'clock-outline',
  'smileys-emotion': 'emoticon-happy-outline',
  'people-body': 'eye-outline',
  'animals-nature': 'leaf-outline',
  'food-drink': 'food-apple',
  'travel-places': 'airplane-variant',
  activities: 'basketball',
  objects: 'lightbulb-outline',
  symbols: 'heart-outline',
  flags: 'flag-outline',
  custom: 'emoticon-custom-outline',
};

const categoryToI18n = {};
CategoryNames.forEach((name) => {
  categoryToI18n[name] = {
    id: CategoryTranslations.get(name),
    defaultMessage: CategoryMessage.get(name),
    icon: icons[name],
  };
});

export const selectEmojisBySection = () => {
  const skinTone = 'default';
  const customEmojiItems = [];
  const recentEmojis = [];
  // for (const [key] of customEmojis) {
  //   customEmojiItems.push({
  //     name: key,
  //   });
  // }
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
      ...categoryToI18n[category],
      key: category,
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
