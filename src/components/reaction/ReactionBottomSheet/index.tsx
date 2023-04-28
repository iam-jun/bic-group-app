import React, { useRef, useState } from 'react';
import {
  Platform, StyleSheet, TextInput, View,
} from 'react-native';

import BottomSheet from '~/baseComponents/BottomSheet';
import EmojiPicker from '~/baseComponents/EmojiPicker';
import EmojiSectionIcons from '~/baseComponents/EmojiPicker/components/EmojiSectionIcons';
import useEmojiPickerStore, { IEmojiPickerState } from '~/baseComponents/EmojiPicker/store';
import { SearchInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import useModalStore from '~/store/modal';
import { dimension } from '~/theme';
import { margin } from '~/theme/spacing';

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const emojiPickerRef: any = useRef();
  const searchInputRef = useRef<TextInput>();
  const { t } = useBaseHook();

  const [sectionIconsVisible, setSectionIconsVisible] = useState(false);

  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const { visible, callback } = useModalStore((state) => state.reactionBottomSheet) || {};
  const modalActions = useModalStore((state) => state.actions);
  const isIOS = Platform.OS === 'ios';
  const SNAP_HEIGHT = isIOS ? 400 : dimension.deviceHeight / 2;

  const _onPressReaction = (key: string) => {
    callback?.(key);
    reactionSheetRef?.current?.close?.();
  };

  const _onClose = () => {
    setSectionIconsVisible(false);
    modalActions.setShowReactionBottomSheet();
  };

  const onOpen = () => {
    setSectionIconsVisible(true);
  };

  const onSearchFocus = isIOS ? () => reactionSheetRef.current?.open('top') : undefined;

  const onChangeText = (text:string) => {
    actions.search(text);
  };

  const onPositionChange = (position: 'top' | 'initial') => {
    if (position === 'initial') {
      searchInputRef.current?.blur();
    }
  };

  const scrollToSectionIndex = (index) => {
    emojiPickerRef.current?.scrollToSectionIndex(index);
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        modalizeRef={reactionSheetRef}
        isOpen={visible}
        snapPoint={isIOS ? SNAP_HEIGHT : undefined}
        adjustToContentHeight={!isIOS}
        closeSnapPointStraightEnabled={false}
        onClose={_onClose}
        onOpen={onOpen}
        onPositionChange={onPositionChange}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          keyboardDismissMode: 'interactive',
          contentContainerStyle: isIOS ? styles.contentContainerStyle : { height: SNAP_HEIGHT },
        }}
        childrenStyle={{ paddingBottom: 0 }}
        ContentComponent={(
          <View style={[styles.container, !isIOS && { height: SNAP_HEIGHT }]}>
            <SearchInput
              style={styles.searchInput}
              inputRef={searchInputRef}
              placeholder={t('sticker:search_emoji')}
              onChangeText={onChangeText}
              onFocus={onSearchFocus}
            />
            <EmojiPicker
              emojiPickerRef={emojiPickerRef}
              onEmojiPress={_onPressReaction}
            />
          </View>
      )}
      />
      <EmojiSectionIcons visible={sectionIconsVisible} onPress={scrollToSectionIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: '100%',
  },
  container: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: margin.base,
    marginBottom: margin.base,
  },

});

export default ReactionBottomSheet;
