import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  FlatList,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {get} from 'lodash';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import {mentionRegex} from '~/constants/commonRegex';
import {TouchableOpacity} from 'react-native-gesture-handler';
import images from '~/resources/images';
import Divider from '~/beinComponents/Divider';

export interface MentionInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  value?: string;
  emptyContent?: string;
  modalPosition: 'top' | 'bottom';
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  onPress?: (item: any) => void;
  onPressAll?: () => void;
  onChangeText?: (value: string) => void;
  onMentionText?: (textMention: string) => void;
  onContentSizeChange?: (data: any) => void;
  ComponentInput?: any;
  componentInputProps?: any;

  getDataPromise?: any;
  getDataParam?: any;
  getDataResponseKey?: string;
}

const MentionInput: React.FC<MentionInputProps> = ({
  style,
  title,
  value,
  emptyContent,
  modalPosition,
  placeholderText,
  textInputStyle,
  modalStyle,
  onPress,
  onPressAll,
  onChangeText,
  onMentionText,
  onContentSizeChange,
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

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyles(theme, modalPosition);

  useEffect(() => {
    if (value && value !== content) {
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

  const _onMentionText = (mentionKey: string) => {
    onMentionText?.(mentionKey);
    getData(mentionKey);
  };

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

  const _onPressItem = useCallback(
    (item: any) => {
      console.log(`\x1b[36m🐣️ MentionInput \x1b[0m`);
      const mention = `@[u:${item.id}:${item.fullname || item.name}] `;
      let newContent;
      if (key) {
        newContent = content.replace(`@${key}`, mention);
      } else {
        //todo handle cursor position
        newContent = content.replace(`@${key}`, mention);
      }
      setContent(newContent);
      onPress?.(item);
      setMentioning(false);
    },
    [key, content],
  );

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => _onPressItem(item)}>
        <Avatar.Medium
          style={styles.avatar}
          source={item.avatar || item.icon}
          placeholderSource={images.img_user_avatar_default}
        />
        <Text>{item.name || item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  const renderMentionAll = () => {
    if (!onPressAll) return null;

    return (
      <TouchableOpacity onPress={onPressAll}>
        <View style={styles.mentionAll}>
          <Text.ButtonBase style={styles.textMentionAll}>@all</Text.ButtonBase>
          <Text.Subtitle useI18n>common:title_mention_all</Text.Subtitle>
        </View>
      </TouchableOpacity>
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
    <View style={[styles.containerWrapper, style]}>
      <ComponentInput
        {...componentInputProps}
        value={content}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        onContentSizeChange={onContentSizeChange}
        style={textInputStyle}
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

const createStyles = (theme: ITheme, position: string) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    containerWrapper: {
      zIndex: 1,
    },
    containerModal: {
      position: 'absolute',
      [position === 'top' ? 'bottom' : 'top']: '100%',
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
  });
};

export default MentionInput;
