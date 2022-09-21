// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Fuse from 'fuse.js';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';

import { useDeviceOrientation, useDimensions } from '@react-native-community/hooks';
import EmojiPicker from './emoji_picker';
import { CategoryNames, EmojiIndicesByAlias, EmojiIndicesByCategory } from '../Emoji/emojis';

function getSkin(emoji) {
  if ('skin_variations' in emoji) {
    return 'default';
  }
  if ('skins' in emoji) {
    return emoji.skins && emoji.skins[0];
  }
  return null;
}

export const selectEmojisByName = () => {
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

export const selectEmojisBySection = () => {
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

function mapStateToProps(state) {
  const theme = useTheme();
  const emojisBySection = selectEmojisBySection(state);
  const emojis = selectEmojisByName(state);
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

  return {
    fuse,
    theme,
    emojis,
    emojisBySection,
    deviceWidth: dimension.screen.width,
    isLandscape: orientation.landscape,
    customEmojisEnabled: true,
    customEmojiPage: state.views.emoji.emojiPickerCustomPage,
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators({
//       getCustomEmojis,
//       incrementEmojiPickerPage,
//     }, dispatch),
//   };
// }

export default connect(mapStateToProps)(EmojiPicker);
