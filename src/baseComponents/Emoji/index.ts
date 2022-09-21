// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { connect } from 'react-redux';

import { EmojiIndicesByAlias, Emojis } from './emojis';

import Emoji from './Emoji';
import { getCustomEmojisByName } from '~/utils/emoji_utils';

type OwnProps = {
    emojiName: string;
}

function mapStateToProps(state: any, ownProps: OwnProps) {
  const { emojiName } = ownProps;
  //   const customEmojis = getCustomEmojisByName(state);
  //   const customEmojis = getCustomEmojisByName(state);
  //   const serverUrl = Client4.getUrl();
  const customEmoji = getCustomEmojisByName(emojiName);
  let imageUrl = '';
  let unicode;
  let assetImage = '';
  let isCustomEmoji = false;
  let displayTextOnly = false;
  if (EmojiIndicesByAlias.has(emojiName)) {
    const emoji = Emojis[EmojiIndicesByAlias.get(emojiName)!];
    if (emoji.category === 'custom') {
      assetImage = emoji.fileName;
      isCustomEmoji = true;
    } else {
      unicode = emoji.image;
    }
  } else if (customEmoji) {
    imageUrl = customEmoji;
    isCustomEmoji = true;
  } else {
    displayTextOnly = true;
  }

  return {
    imageUrl,
    assetImage,
    isCustomEmoji,
    displayTextOnly,
    unicode,
  };
}

export default connect(mapStateToProps)(Emoji);
