import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import _, {debounce, get} from 'lodash';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import Divider from '~/beinComponents/Divider';

import Text from '~/beinComponents/Text';
import {mentionRegex} from '~/constants/commonRegex';
import {useKeyboardStatus} from '~/hooks/keyboard';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import Div from '../Div';

const DEFAULT_INDEX = -2;
const MENTION_ALL_INDEX = -1;

export interface MentionInputProps extends TextInputProps {
  mentionInputRef?: any;
  textInputRef?: any;
  style?: StyleProp<ViewStyle>;
  title?: string;
  emptyContent?: string;
  modalPosition: 'top' | 'bottom';
  disabled?: boolean;
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  showShadow?: boolean;
  onPress?: (item: any) => void;
  onPressAll?: () => void;
  showItemAll?: boolean;
  allReplacer?: string;
  onChangeText?: (value: string) => void;
  onMentionText?: (textMention: string) => void;
  ComponentInput?: any;
  componentInputProps?: any;
  mentionField?: string;

  getDataPromise?: any;
  getDataParam?: any;
  getDataResponseKey?: string;
}

const MentionInput: React.FC<MentionInputProps> = ({
  mentionInputRef,
  textInputRef,
  style,
  title,
  emptyContent,
  modalPosition,
  disabled,
  placeholderText,
  textInputStyle,
  modalStyle,
  fullWidth,
  showShadow = true,
  onPress,
  onPressAll,
  showItemAll,
  allReplacer,
  onChangeText,
  onMentionText,
  ComponentInput = TextInput,
  componentInputProps = {},
  mentionField = 'id',

  getDataPromise,
  getDataParam,
  getDataResponseKey = '',
}: MentionInputProps) => {
  const _mentionInputRef = mentionInputRef || useRef<any>();
  const inputRef = textInputRef || useRef<TextInput>();
  const listRef = useRef<any>();
  const [mentioning, setMentioning] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [inputSelection, setInputSelection] = useState<any>();
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [highlightItem, sethHighlightItem] = useState<any>();
  const [highlightIndex, setHighlightIndex] = useState<number>(DEFAULT_INDEX);

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyles(
    theme,
    modalPosition,
    topPosition,
    measuredHeight,
  );

  useEffect(() => {
    onChangeText?.(content);
  }, [content]);

  useEffect(() => {
    if (!mentioning && highlightIndex !== DEFAULT_INDEX) {
      setHighlightIndex(DEFAULT_INDEX);
      sethHighlightItem(undefined);
    }
  }, [mentioning]);

  const getContent = () => content;

  useImperativeHandle(_mentionInputRef, () => ({
    setContent,
    getContent,
  }));

  const getData = (mentionKey: string, getDataParam: any) => {
    if (getDataPromise && getDataParam) {
      const param = {...getDataParam, key: mentionKey};
      setIsLoading(true);
      getDataPromise?.(param)
        ?.then?.((response: any) => {
          setIsLoading(false);
          const newList = get(response, getDataResponseKey) || [];
          setList(newList);
          setKey(mentionKey);
        })
        ?.catch((e: any) => {
          console.log(
            `\x1b[34m🐣️ MentionInput get data error: `,
            `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
          );
          setIsLoading(false);
          setList([]);
          setHighlightIndex(DEFAULT_INDEX);
          sethHighlightItem(undefined);
        });
    }
  };

  const _onStartMention = () => {
    getData('', getDataParam);
  };

  const _onMentionText = useRef(
    debounce((mentionKey: string, getDataParam: any) => {
      onMentionText?.(mentionKey);
      getData(mentionKey, getDataParam);
    }, 200),
  ).current;

  const _onChangeText = (text: string) => {
    let isMention = false;
    const matches = text?.match?.(mentionRegex);
    let mentionKey = '';
    if (text && matches && matches.length > 0) {
      mentionKey = matches[matches.length - 1]?.replace('@', '');
      isMention = true;
    }
    if (text?.[text?.length - 1] === '@') {
      _onStartMention();
      isMention = true;
    }
    if (mentionKey) {
      _onMentionText(mentionKey, getDataParam);
    }
    setMentioning(isMention);
    setContent(text);
  };

  const replaceContent = (
    content: string,
    searchValue: string,
    replacer: string,
  ) => {
    if (searchValue === '@') {
      const selectionStart = inputSelection?.start || 0;
      let head = content?.substr(0, selectionStart) || '';
      if (head?.[head.length - 1] === '@') {
        head = head.substr(0, head.length - 1);
      }
      const tail = content?.substr(selectionStart + 1);
      return `${head}${replacer}${tail}`;
    } else {
      return content?.replace?.(searchValue, replacer);
    }
  };

  const _onPressItem = useCallback(
    (item: any) => {
      const mention = `@[u:${item[mentionField]}:${
        item.fullname || item.name
      }] `;
      inputRef.current?.focus();
      const newContent = replaceContent(content, `@${key}`, mention);
      setContent(newContent);
      componentInputProps?.commentInputRef?.current?.setText?.(
        newContent || '',
      );
      onPress?.(item);
      setMentioning(false);
    },
    [key, content],
  );

  const _onPressAll = () => {
    inputRef.current?.focus();
    onPressAll?.();
    if (allReplacer) {
      const newContent = replaceContent(content, `@${key}`, allReplacer);
      setContent(newContent);
      componentInputProps?.commentInputRef?.current?.setText?.(
        newContent || '',
      );
    }
    setMentioning(false);
  };

  const onSelectionChange = (event: any) => {
    setInputSelection(event.nativeEvent.selection);
  };

  // @ts-ignore
  const _onContentSizeChange = e => {
    setTopPosition(e.nativeEvent.contentSize.height);
  };

  const isKeyboardOpen = useKeyboardStatus();
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
    if (mentioning && list?.length > 0) {
      event.preventDefault();
      const {key} = event || {};
      if (key === 'Enter' && highlightItem) {
        _onPressItem(highlightItem);
        return;
      }
      const step = key === 'ArrowUp' ? -1 : 1;
      const min = showItemAll ? MENTION_ALL_INDEX : 0;
      let newIndex =
        highlightIndex === DEFAULT_INDEX ? min : highlightIndex + step;
      if (newIndex >= list.length) {
        newIndex = min;
      }
      if (newIndex < min) {
        newIndex = list.length - 1;
      }

      let newHighlightItem: any = list?.[newIndex];
      if (newIndex === MENTION_ALL_INDEX) {
        newHighlightItem = {id: 'all'};
      }
      if (newIndex >= 0 && newIndex < list?.length) {
        listRef.current?.scrollToIndex({
          index: newIndex,
          viewPosition: 0.5,
        });
      }
      setHighlightIndex(newIndex);
      sethHighlightItem(newHighlightItem);
    }
  };

  const onKeyPress = (event: any) => {
    if (Platform.OS === 'web') {
      switch (event?.key) {
        case 'Enter':
        case 'ArrowDown':
        case 'ArrowUp':
          handleMentionKey(event);
          break;
      }
    }
  };

  const onHoverItem = (item: any, index: number) => {
    setHighlightIndex(index);
    sethHighlightItem(item);
  };

  const onLeaveItem = (item: any, index: number) => {
    setHighlightIndex(DEFAULT_INDEX);
    sethHighlightItem(undefined);
  };

  const _renderItem = ({item, index}: {item: any; index: number}) => {
    const backgroundColor =
      highlightItem?.[mentionField] &&
      item?.[mentionField] === highlightItem?.[mentionField]
        ? colors.placeholder
        : colors.background;

    return (
      <Div
        style={{backgroundColor}}
        onMouseOver={() => onHoverItem(item, index)}
        onMouseLeave={() => onLeaveItem(item, index)}>
        <TouchableOpacity
          style={[styles.item]}
          onPress={() => _onPressItem(item)}>
          <Avatar.Medium
            style={styles.avatar}
            source={item.avatar || item.icon}
            placeholderSource={images.img_user_avatar_default}
          />
          <Text>{item.name || item.fullname}</Text>
        </TouchableOpacity>
      </Div>
    );
  };

  const renderMentionAll = () => {
    if (!onPressAll && !showItemAll) return null;
    const backgroundColor =
      highlightItem?.id === 'all' ? colors.placeholder : colors.background;

    return (
      <Div
        onMouseOver={() => onHoverItem({id: 'all'}, MENTION_ALL_INDEX)}
        onMouseLeave={() => onLeaveItem({id: 'all'}, MENTION_ALL_INDEX)}>
        <TouchableOpacity onPress={_onPressAll}>
          <View style={[styles.mentionAll, {backgroundColor}]}>
            <Text.ButtonBase style={styles.textMentionAll}>
              @all
            </Text.ButtonBase>
            <Text.Subtitle useI18n>common:title_mention_all</Text.Subtitle>
          </View>
        </TouchableOpacity>
      </Div>
    );
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

  return (
    <View
      style={[styles.containerWrapper, style]}
      onLayout={_onLayoutContainer}>
      {Platform.OS === 'web' && (
        /*
        Duplicate ComponentInput because _onContentSizeChange
        in the below component could not work some times on web.
        Make sure this and the below ComponentInput share the same styling
        */
        <ComponentInput
          nativeID="component-input--hidden"
          value={content}
          multiline
          style={styles.hidden}
          onContentSizeChange={_onContentSizeChange}
          editable={!disabled}
          onKeyPress={onKeyPress}
        />
      )}
      <ComponentInput
        {...componentInputProps}
        value={content}
        textInputRef={inputRef}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        onContentSizeChange={
          Platform.OS === 'web' ? undefined : _onContentSizeChange
        }
        style={[textInputStyle, disabled ? {color: colors.textSecondary} : {}]}
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        onKeyPress={onKeyPress}
      />
      {mentioning && (
        <View
          style={[
            styles.containerModal,
            fullWidth && styles.containerModalFullWidth,
            showShadow && styles.shadow,
            modalStyle,
          ]}>
          {!!title && (!key || list?.length === 0) && (
            <Text.Subtitle style={styles.textTitle}>{title}</Text.Subtitle>
          )}
          {renderMentionAll()}
          <Divider />
          <FlatList
            ref={listRef}
            keyboardShouldPersistTaps={'always'}
            data={list || []}
            nestedScrollEnabled
            ListEmptyComponent={renderEmpty}
            renderItem={_renderItem}
            keyExtractor={item => item.id || item._id}
            onScrollToIndexFailed={() => {}}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (
  theme: ITheme,
  position: string,
  topPosition: number,
  measuredHeight: number,
) => {
  const {colors, spacing} = theme;
  const maxTopPosition =
    Platform.OS === 'web' ? (measuredHeight * 3) / 4 : measuredHeight / 2;

  let stylePosition;
  if (position === 'top') {
    stylePosition = {
      bottom: '100%',
    };
  } else {
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
      maxHeight: 300,
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

export default MentionInput;
