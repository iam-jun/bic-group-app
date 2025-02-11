import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';

import spacing from '~/theme/spacing';
import { AutocompleteProps } from '..';

import AtMentionItem from './AtMentionItem';
import useMentionInputStore from '../../store';
import IMentionInputState, { ICursorPositionChange } from '../../store/Interface';

type Props = Partial<AutocompleteProps>;

const AtMention = ({
  showSpectialItems,
  emptyContent,
  cursorPosition,
}: Props) => {
  const data = useMentionInputStore((state: IMentionInputState) => state.data);
  const loading = useMentionInputStore((state: IMentionInputState) => state.loading);
  const doRunSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const doCompleteMention = useMentionInputStore((state: IMentionInputState) => state.doCompleteMention);

  const text = useRef('');

  const listRef = useRef<any>();

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = createStyles(theme);

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'autocomplete-on-selection-change',
        onCursorPositionChange,
      );
      return () => {
        listener?.remove?.();
      };
    }, [],
  );

  const onCursorPositionChange = debounce(
    ({ position, value, groupIds }: ICursorPositionChange) => {
      text.current = value;
      const textBeforeCursor = value.substring(0, position);
      doRunSearch(groupIds, textBeforeCursor);
    },
    100,
  );

  const _completeMention = (item: any) => {
    doCompleteMention({
      item, text: text.current, cursorPosition,
    });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator
          testID="at_mention.loading"
          color={colors.gray30}
        />
      ) : (
        <Text.H6 testID="at_mention.empty_content" style={styles.textEmpty}>
          {emptyContent}
        </Text.H6>
      )}
    </View>
  );

  const renderItem = ({ item, index }: {item: any; index: number}) => (
    <AtMentionItem
      testID={`at_mention.item_${index}`}
      item={item}
      onPress={_completeMention}
    />
  );

  const _data = showSpectialItems ? [{ username: 'all' }, ...data] : data;

  return (
    <FlatList
      testID="at_mention"
      ref={listRef}
      data={_data}
      keyExtractor={(item) => `list-mention-${item.username}`}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    textEmpty: {
      color: colors.gray40,
      padding: spacing.padding.tiny,
      margin: spacing.margin.small,
    },
    emptyContainer: {
      minHeight: 40,
      justifyContent: 'center',
    },
  });
};

export default AtMention;
