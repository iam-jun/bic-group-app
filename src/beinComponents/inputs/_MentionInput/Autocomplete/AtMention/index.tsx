import {isEmpty} from 'lodash';
import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Text from '~/beinComponents/Text';
import {AT_MENTION_REGEX} from '~/constants/autocomplete';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import {AutocompleteProps} from '../../Autocomplete';
import {getMatchTermForAtMention} from '../../helper';
import actions from '../../redux/actions';
import AtMentionItem from './AtMentionItem';

const DEFAULT_INDEX = -1;

interface Props extends Partial<AutocompleteProps> {}

const AtMention = ({
  showSpectialItems,
  emptyContent,
  onCompletePress,
}: Props) => {
  const dispatch = useDispatch();

  const {data, isLoading, highlightIndex} = useKeySelector('mentionInput');

  const text = useRef('');
  const cursorPosition = useRef(0);

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
  }: {
    position: number;
    value: string;
    groupIds: string;
  }) => {
    text.current = value;
    cursorPosition.current = position;

    const _text = value.substring(0, position);
    const _matchTerm = getMatchTermForAtMention(_text, false);
    if (_matchTerm !== null && !_matchTerm.endsWith(' ')) {
      dispatch(actions.runSearch({group_ids: groupIds, key: _matchTerm}));
    } else {
      dispatch(actions.setData([]));
    }
  };

  const completeMention = (item: any) => {
    const mention = item.username;
    const mentionPart = text.current.substring(0, cursorPosition.current);

    let completedDraft = mentionPart.replace(AT_MENTION_REGEX, `@${mention} `);

    if (text.current.length > cursorPosition.current) {
      completedDraft += text.current.substring(cursorPosition.current);
    }
    onCompletePress?.(completedDraft);
    dispatch(actions.setData([]));
  };

  const handleMentionKey = (event: any) => {
    if (!isEmpty(data)) {
      event.preventDefault();
      const {key} = event || {};
      if (key === 'Enter' && data?.[highlightIndex]) {
        completeMention(data?.[highlightIndex]);
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
        {isLoading ? (
          <ActivityIndicator color={colors.disabled} />
        ) : (
          <Text.H6 style={styles.textEmpty}>{emptyContent}</Text.H6>
        )}
      </View>
    );
  };

  const renderItem = ({item}: {item: any; index: number}) => {
    return <AtMentionItem item={item} onPress={completeMention} />;
  };

  if (isEmpty(data)) return null;

  const _data = showSpectialItems ? [{username: 'all'}, ...data] : data;

  return (
    <FlatList
      ref={listRef}
      data={_data}
      keyExtractor={item => `list-mention-${item.id}`}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    textTitle: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.base,
      color: colors.textSecondary,
    },
    textEmpty: {
      color: colors.textDisabled,
      padding: spacing.padding.tiny,
      margin: spacing.margin.small,
    },
    emptyContainer: {
      minHeight: 40,
      justifyContent: 'center',
    },
    hidden: {
      height: 0,
      flex: undefined,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
      ...Platform.select({
        web: {
          border: 'none',
          marginTop: '0px important',
          marginBottom: '0px important',
        },
      }),
    },
  });
};

export default AtMention;
