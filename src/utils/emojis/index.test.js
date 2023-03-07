import {
  compareEmojis, formatTextWithEmoji, getCustomEmojisByName, getEmojiCode, getEmoticonName,
} from '.';
import custom_emojis from '~/resources/custom_emojis';

describe('emojis utils', () => {
  it('should getEmoticonName correctly', () => {
    const test1 = getEmoticonName(':)');
    expect(test1).toEqual('slightly_smiling_face');

    const test2 = getEmoticonName('::::)');
    expect(test2).toEqual(undefined);
  });

  it('should compareEmojis correctly', () => {
    const test1 = compareEmojis(null, 'smile');
    expect(test1).toEqual(1);

    const test2 = compareEmojis('smile', null);
    expect(test2).toEqual(-1);

    const test3 = compareEmojis('slightly_smiling_face', 'smile');
    expect(test3).toEqual(-1);

    const test4 = compareEmojis({ short_name: 'smile' }, { name: 'scream' });
    expect(test4).toEqual(1);

    const test5 = compareEmojis('slightly_smiling_face', 'slightly_frowning_face', 'slightly');
    expect(test5).toEqual(1);

    const test6 = compareEmojis('slightly_smiling_face', 'smile', 'slightly');
    expect(test6).toEqual(-1);

    const test7 = compareEmojis('smile', 'slightly_frowning_face', 'slightly');
    expect(test7).toEqual(1);

    const test8 = compareEmojis('smile', 'scream', 'slightly');
    expect(test8).toEqual(1);
  });

  it('should getCustomEmojisByName correctly', () => {
    const test1 = getCustomEmojisByName('smile');
    expect(test1).toEqual(null);

    const test2 = getCustomEmojisByName('bic_check_mark');
    expect(test2).toEqual(custom_emojis.bic_check_mark);
  });

  it('should getEmojiCode correctly', () => {
    const test1 = getEmojiCode('emoji_not_exist');
    expect(test1).toEqual(':emoji_not_exist:');

    const test2 = getEmojiCode('smile');
    expect(test2).toEqual('😄');
  });

  it('should formatTextWithEmoji correctly', () => {
    const emoji = 'smile';
    const emojiUnicode = '😄';
    const test1 = formatTextWithEmoji('text', emoji);
    expect(test1).toEqual(`text ${emojiUnicode} `);

    const test2 = formatTextWithEmoji('text next', emoji, 4);
    expect(test2).toEqual(`text ${emojiUnicode} next`);

    const test3 = formatTextWithEmoji('textnext', emoji, 4);
    expect(test3).toEqual(`text ${emojiUnicode} next`);
  });
});
