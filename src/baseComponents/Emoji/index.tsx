// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import { EmojiIndicesByAlias, Emojis } from './emojis';

import EmojiComponent, { EmojiProps } from './EmojiComponent';
import { getCustomEmojisByName } from '~/utils/emoji_utils';

function Emoji(ownProps: EmojiProps) {
  const { emojiName } = ownProps;
  //   const customEmojis = getCustomEmojisByName(state);
  //   const customEmojis = getCustomEmojisByName(state);
  //   const serverUrl = Client4.getUrl();
  const customEmoji = getCustomEmojisByName(emojiName);
  const imageUrl = '';
  let unicode;
  let assetImage = '';
  let displayTextOnly = false;
  if (customEmoji) {
    assetImage = customEmoji.path;
  } else if (EmojiIndicesByAlias.has(emojiName)) {
    const emoji = Emojis[EmojiIndicesByAlias.get(emojiName)!];
    if (emoji.category === 'custom') {
      assetImage = emoji.fileName;
    } else {
      unicode = emoji.image;
    }
  } else {
    displayTextOnly = true;
  }

  const props = {
    ...ownProps,
    imageUrl,
    assetImage,
    displayTextOnly,
    unicode,
  };

  return (
    <EmojiComponent {...props} />
  );
}

export default Emoji;
