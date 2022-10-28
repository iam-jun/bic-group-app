import { DeviceEventEmitter } from 'react-native';
import { AT_MENTION_REGEX } from '~/constants/autocomplete';
import { ICompleteMention } from '../Interface';

const completeMention = (set, _) => async (payload: ICompleteMention) => {
  const { item, text, cursorPosition } = payload;
  let _cursorPosition = cursorPosition;
  if (!_cursorPosition) {
    _cursorPosition = text.length;
  }
  const mention = item.username;
  const mentionPart = text.substring(
    0, _cursorPosition,
  );

  let completedDraft = mentionPart.replace(
    AT_MENTION_REGEX, `@${mention} `,
  );

  if (text.length > _cursorPosition) {
    completedDraft += text.substring(_cursorPosition);
  }
  DeviceEventEmitter.emit(
    'mention-input-on-complete-mention', completedDraft,
  );
  set((state) => {
    state.data = [];
    state.fullContent = completedDraft;
    state.tempSelected[mention] = { id: item?.id, data: item };
  }, 'completeMention');

  // For testing output
  return {
    _cursorPosition,
    completedDraft,
  };
};

export default completeMention;
