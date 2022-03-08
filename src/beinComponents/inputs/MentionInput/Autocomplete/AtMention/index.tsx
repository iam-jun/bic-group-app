import {isEmpty} from 'lodash';
import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import {AutocompleteProps} from '..';
import {
  checkRunSearch,
  completeMention,
  ICursorPositionChange,
} from '../../helper';
import actions from '../../redux/actions';
import AtMentionItem from './AtMentionItem';

const DEFAULT_INDEX = -1;

type Props = Partial<AutocompleteProps>;

const AtMention = ({
  showSpectialItems,
  emptyContent,
  cursorPosition,
}: Props) => {
  const dispatch = useDispatch();

  const {data, loading, highlightIndex} = useKeySelector('mentionInput');

  const text = useRef('');

  const listRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(theme);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-selection-change',
      onCursorPositionChange,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-key-press',
      handleMentionKey,
    );
    return () => {
      listener?.remove?.();
    };
  }, [data, highlightIndex]);

  const onCursorPositionChange = ({
    position,
    value,
    groupIds,
  }: ICursorPositionChange) => {
    text.current = value;
    checkRunSearch(value.substring(0, position), groupIds, dispatch);
  };

  const _completeMention = (item: any) => {
    completeMention({item, dispatch, text: text.current, cursorPosition});
  };

  const handleMentionKey = (event: any) => {
    if (!isEmpty(data)) {
      event.preventDefault();
      const {key} = event || {};
      if (key === 'Enter' && data?.[highlightIndex]) {
        _completeMention(data[highlightIndex]);
        return;
      }
      const step = key === 'ArrowUp' ? -1 : 1;
      const min = 0;
      let newIndex =
        highlightIndex === DEFAULT_INDEX ? min : highlightIndex + step;
      if (newIndex >= data.length) {
        newIndex = min;
      }
      if (newIndex < min) {
        newIndex = data.length - 1;
      }

      const newHighlightItem: any = data?.[newIndex];

      if (newIndex >= 0 && newIndex < data?.length) {
        listRef.current?.scrollToIndex({
          index: newIndex,
          viewPosition: 0.5,
        });
      }
      dispatch(actions.sethHighlightIndex(newIndex));
      dispatch(actions.sethHighlightItem(newHighlightItem));
    }
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {loading ? (
          <ActivityIndicator
            testID="at_mention.loading"
            color={colors.disabled}
          />
        ) : (
          <Text.H6 testID="at_mention.empty_content" style={styles.textEmpty}>
            {emptyContent}
          </Text.H6>
        )}
      </View>
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <AtMentionItem
        testID={`at_mention.item_${index}`}
        item={item}
        onPress={_completeMention}
      />
    );
  };

  const _data = showSpectialItems ? [{username: 'all'}, ...data] : data;

  return (
    <FlatList
      testID="at_mention"
      ref={listRef}
      data={_data}
      keyExtractor={item => `list-mention-${item.username}`}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    textEmpty: {
      color: colors.textDisabled,
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
``;
