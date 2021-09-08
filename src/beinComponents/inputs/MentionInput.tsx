import _, {debounce, get} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import Divider from '~/beinComponents/Divider';

import Text from '~/beinComponents/Text';
import {mentionRegex} from '~/constants/commonRegex';
import {useKeyboardStatus} from '~/hooks/keyboard';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import Div from '../Div';

export interface MentionInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  title?: string;
  emptyContent?: string;
  modalPosition: 'top' | 'bottom';
  disabled?: boolean;
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  onPress?: (item: any) => void;
  onPressAll?: () => void;
  showItemAll?: boolean;
  allReplacer?: string;
  onChangeText?: (value: string) => void;
  onMentionText?: (textMention: string) => void;
  ComponentInput?: any;
  componentInputProps?: any;

  getDataPromise?: any;
  getDataParam?: any;
  getDataResponseKey?: string;
}

const MentionInput: React.FC<MentionInputProps> = ({
  style,
  value,
  title,
  emptyContent,
  modalPosition,
  disabled,
  placeholderText,
  textInputStyle,
  modalStyle,
  onPress,
  onPressAll,
  showItemAll,
  allReplacer,
  onChangeText,
  onMentionText,
  ComponentInput = TextInput,
  componentInputProps = {},

  getDataPromise,
  getDataParam,
  getDataResponseKey = '',
}: MentionInputProps) => {
  const [mentioning, setMentioning] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [inputSelection, setInputSelection] = useState<any>();
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [hoverItem, setHoverItem] = useState<any>('');

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyles(
    theme,
    modalPosition,
    topPosition,
    measuredHeight,
  );

  useEffect(() => {
    if (value !== undefined && value != content) {
      setContent(value);
    }
  }, [value]);

  useEffect(() => {
    onChangeText?.(content);
  }, [content]);

  const getData = (mentionKey: string) => {
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
        });
    }
  };

  const _onStartMention = () => {
    getData('');
  };

  const _onMentionText = debounce((mentionKey: string) => {
    onMentionText?.(mentionKey);
    getData(mentionKey);
  }, 200);

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
      _onMentionText(mentionKey);
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
      const mention = `@[u:${item.id || item._id}:${
        item.fullname || item.name
      }] `;
      setContent(replaceContent(content, `@${key}`, mention));
      onPress?.(item);
      setMentioning(false);
    },
    [key, content],
  );

  const _onPressAll = () => {
    onPressAll?.();
    if (allReplacer) {
      setContent(replaceContent(content, `@${key}`, allReplacer));
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

  const _renderItem = ({item}: {item: any}) => {
    const backgroundColor =
      (hoverItem?.id && item?.id === hoverItem?.id) ||
      (hoverItem?._id && item?._id === hoverItem?._id)
        ? colors.placeholder
        : colors.background;

    return (
      <Div
        style={{backgroundColor}}
        onMouseOver={() => setHoverItem(item)}
        onMouseLeave={() => setHoverItem(null)}>
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
      hoverItem?.id === 'all' ? colors.placeholder : colors.background;

    return (
      <Div
        onMouseOver={() => setHoverItem({id: 'all'})}
        onMouseLeave={() => setHoverItem(null)}>
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
        <ComponentInput
          value={content}
          multiline
          style={styles.hidden}
          onContentSizeChange={_onContentSizeChange}
          editable={!disabled}
        />
      )}
      <ComponentInput
        {...componentInputProps}
        value={content}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        onContentSizeChange={
          Platform.OS === 'web' ? undefined : _onContentSizeChange
        }
        style={[textInputStyle, disabled ? {color: colors.textSecondary} : {}]}
        onSelectionChange={onSelectionChange}
        editable={!disabled}
      />
      {mentioning && (
        <View style={[styles.containerModal, modalStyle]}>
          {!!title && (!key || list?.length === 0) && (
            <Text.Subtitle style={styles.textTitle}>{title}</Text.Subtitle>
          )}
          {renderMentionAll()}
          <Divider margin={spacing.margin.small} />
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={list || []}
            ListEmptyComponent={renderEmpty}
            renderItem={_renderItem}
            keyExtractor={item => item.id || item._id}
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
      maxHeight: 236,
      borderRadius: 6,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignSelf: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
      zIndex: 2,
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
