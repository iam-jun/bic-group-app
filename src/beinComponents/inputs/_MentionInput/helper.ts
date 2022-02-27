import {DeviceEventEmitter, Platform} from 'react-native';
import {
  AT_MENTION_REGEX,
  AT_MENTION_SEARCH_REGEX,
} from '~/constants/autocomplete';
import actions from '~/beinComponents/inputs/_MentionInput/redux/actions';

export const getMatchTermForAtMention = (() => {
  let lastMatchTerm: string | null = null;
  let lastValue: string;
  let lastIsSearch: boolean;
  return (value: string, isSearch: boolean): string | null => {
    if (value !== lastValue || isSearch !== lastIsSearch) {
      const regex = isSearch ? AT_MENTION_SEARCH_REGEX : AT_MENTION_REGEX;
      let term = value;
      if (term.startsWith('from: @') || term.startsWith('from:@')) {
        term = term.replace('@', '');
      }

      const match = term.match(regex);
      lastValue = value;
      lastIsSearch = isSearch;
      if (match) {
        lastMatchTerm = (isSearch ? match[1] : match[2]).toLowerCase();
      } else {
        lastMatchTerm = null;
      }
    }
    return lastMatchTerm;
  };
})();

export function switchKeyboardForCodeBlocks(
  value: string,
  cursorPosition: number,
) {
  if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 12) {
    const regexForCodeBlock = /^```$(.*?)^```$|^```$(.*)/gms;

    const matches = [];
    let nextMatch;
    while ((nextMatch = regexForCodeBlock.exec(value)) !== null) {
      matches.push({
        startOfMatch: regexForCodeBlock.lastIndex - nextMatch[0].length,
        endOfMatch: regexForCodeBlock.lastIndex + 1,
      });
    }

    const cursorIsInsideCodeBlock = matches.some(
      match =>
        cursorPosition >= match.startOfMatch &&
        cursorPosition <= match.endOfMatch,
    );

    // 'email-address' keyboardType prevents iOS emdash autocorrect
    if (cursorIsInsideCodeBlock) {
      return 'email-address';
    }
  }

  return 'default';
}

export const completeMention = ({
  item,
  cursorPosition,
  text,
  dispatch,
}: {
  item: any;
  cursorPosition?: number;
  text: string;
  dispatch: any;
}) => {
  if (!cursorPosition) {
    cursorPosition = text.length;
  }
  const mention = item.username;
  const mentionPart = text.substring(0, cursorPosition);

  let completedDraft = mentionPart.replace(AT_MENTION_REGEX, `@${mention} `);

  if (text.length > cursorPosition) {
    completedDraft += text.substring(cursorPosition);
  }
  DeviceEventEmitter.emit('mention-input-on-complete-mention', completedDraft);
  dispatch(actions.setData([]));
};
