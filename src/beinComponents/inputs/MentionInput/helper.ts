import { DeviceEventEmitter, Platform } from 'react-native';
import { AT_MENTION_REGEX } from '~/constants/autocomplete';
import actions from '~/beinComponents/inputs/MentionInput/redux/actions';

export interface ICursorPositionChange {
  position: number;
  value: string;
  groupIds: string;
}

export const getMatchTermForAtMention = (() => {
  let lastMatchTerm: string | null = null;
  let lastValue: string;
  return (value: string): string | null => {
    if (value !== lastValue) {
      const regex = AT_MENTION_REGEX;
      let term = value;
      if (term.startsWith('from: @') || term.startsWith('from:@')) {
        term = term.replace('@', '');
      }

      const match = term.match(regex);
      lastValue = value;
      if (match) {
        lastMatchTerm = match[2].toLowerCase();
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
    // eslint-disable-next-line no-cond-assign
    while ((nextMatch = regexForCodeBlock.exec(value)) !== null) {
      matches.push({
        startOfMatch: regexForCodeBlock.lastIndex - nextMatch[0].length,
        endOfMatch: regexForCodeBlock.lastIndex + 1,
      });
    }

    const cursorIsInsideCodeBlock = matches.some(
      (match) => cursorPosition >= match.startOfMatch
        && cursorPosition <= match.endOfMatch,
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

  dispatch(actions.addTempSelected({ [mention]: { id: item?.id, data: item } }));

  // For testing output
  return {
    cursorPosition,
    completedDraft,
  };
};

export const checkRunSearch = (text: string, groupIds: any, dispatch: any) => {
  let flagRun = false;

  const _matchTerm = getMatchTermForAtMention(text);

  if (_matchTerm !== null && !_matchTerm.endsWith(' ')) {
    flagRun = true;
    dispatch(actions.runSearch({ group_ids: groupIds, key: _matchTerm }));
  } else {
    dispatch(actions.setData([]));
  }

  // For testing output
  return flagRun;
};
