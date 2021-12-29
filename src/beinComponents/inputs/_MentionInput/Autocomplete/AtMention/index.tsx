import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {isEmpty} from 'lodash';
import Text from '~/beinComponents/Text';
import {useKeyboardStatus} from '~/hooks/keyboard';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import {AutocompleteProps} from '../../Autocomplete';
import {getMatchTermForAtMention} from '../../helper';
import actions from '../../redux/actions';
import AtMentionItem from './AtMentionItem';

const DEFAULT_INDEX = -1;
const MENTION_ALL_INDEX = -1;

const AtMention = ({
  groupIds,
  modalPosition,
  showSpectialItems,
  emptyContent,
}: AutocompleteProps) => {
  const dispatch = useDispatch();

  const {text, cursorPosition, data, isLoading, highlightIndex} =
    useKeySelector('mentionInput');
  const {isOpen: isKeyboardOpen, height: keyboardHeight} = useKeyboardStatus();
  const windowDimension = useWindowDimensions();

  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [matchTerm, setMatchTerm] = useState<string | null>(null);

  const listRef = useRef<FlatList<any>>();

  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(
    theme,
    modalPosition,
    topPosition,
    measuredHeight,
    keyboardHeight,
    windowDimension.height,
    data.length === 0,
  );

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-key-press',
      handleMentionKey,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  useEffect(() => {
    const value = text.substring(0, cursorPosition);
    const _matchTerm = getMatchTermForAtMention(value, false);

    if (_matchTerm !== matchTerm) setMatchTerm(_matchTerm);
  }, [cursorPosition]);

  useEffect(() => {
    if (matchTerm) {
      dispatch(actions.runSearch({group_ids: groupIds, key: matchTerm}));
    } else {
      dispatch(actions.setData([]));
    }
  }, [matchTerm]);

  // @ts-ignore
  const onContentSizeChange = e => {
    setTopPosition(e.nativeEvent.contentSize.height);
  };

  const debounceSetMeasuredHeight = _.debounce(height => {
    setMeasuredHeight(height);
  }, 80);

  const _onLayoutContainer = useCallback(
    e => {
      debounceSetMeasuredHeight(e.nativeEvent.layout.height);
    },
    [isKeyboardOpen],
  );

  const handleMentionKey = (event: any) => {
    if (!isEmpty(data)) {
      event.preventDefault();
      const {key} = event || {};
      // if (key === 'Enter' && highlightItem) {
      //   _onPressItem(highlightItem);
      //   return;
      // }
      const step = key === 'ArrowUp' ? -1 : 1;
      // const min = showSpectialItems ? MENTION_ALL_INDEX : 0;
      const min = 0;
      let newIndex =
        highlightIndex === DEFAULT_INDEX ? min : highlightIndex + step;
      if (newIndex >= data.length) {
        newIndex = min;
      }
      if (newIndex < min) {
        newIndex = data.length - 1;
      }

      console.log('handleMentionKey', key, highlightIndex, newIndex);

      let newHighlightItem: any = data?.[newIndex];
      if (newIndex === MENTION_ALL_INDEX) {
        newHighlightItem = {id: 'all'};
      }
      if (newIndex >= 0 && newIndex < data?.length) {
        listRef.current?.scrollToIndex({
          index: newIndex,
          viewPosition: 0.5,
        });
      }
      dispatch(actions.sethHighlightIndex(newIndex));
      dispatch(actions.sethHighlightItem(newHighlightItem));
      // setHighlightIndex(newIndex);
      // sethHighlightItem(newHighlightItem);
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

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return <AtMentionItem item={item} index={index} />;
  };

  if (_.isEmpty(data)) return null;

  return (
    <View style={styles.containerModal}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        // onContentSizeChange={onContentSizeChange}
      />
    </View>
  );
};

const createStyles = (
  theme: ITheme,
  position: string,
  topPosition: number,
  measuredHeight: number,
  keyboardHeight: number,
  screenHeight: number,
  isListEmpty: boolean,
) => {
  const {colors, spacing} = theme;
  const maxTopPosition =
    Platform.OS === 'web' ? (measuredHeight * 3) / 4 : measuredHeight / 2;

  const minViewableContent = 220;
  const modalHeight = isListEmpty
    ? 80
    : screenHeight - keyboardHeight - minViewableContent;

  const maxModalHeight = Math.min(modalHeight, 300);

  let stylePosition = {};
  switch (position) {
    case 'top':
      stylePosition = {
        bottom: measuredHeight,
      };
      break;
    case 'above-keyboard':
      stylePosition = {
        bottom: 0,
      };
      break;
    default:
      if (topPosition > maxTopPosition) {
        const distance = measuredHeight - topPosition;
        stylePosition = {
          bottom: distance <= 20 ? 35 : distance + 10,
        };
      } else {
        stylePosition = {
          top: topPosition + 20,
        };
      }
      break;
  }

  return StyleSheet.create({
    containerWrapper: {
      zIndex: 1,
    },
    containerModal: {
      position: 'absolute',
      ...stylePosition,
      width: '85%',
      maxWidth: 355,
      maxHeight: maxModalHeight,
      borderRadius: 6,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignSelf: 'center',
      zIndex: 2,
    },
    containerModalFullWidth: {
      width: '100%',
      maxWidth: undefined,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
    textInputWrapper: {
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.placeholder,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginHorizontal: spacing?.margin.base,
      marginVertical: spacing?.margin.small,
    },
    mentionAll: {
      flexDirection: 'row',
      padding: spacing?.padding.base,
      alignItems: 'center',
    },
    textMentionAll: {
      marginEnd: spacing?.margin.base,
    },
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
