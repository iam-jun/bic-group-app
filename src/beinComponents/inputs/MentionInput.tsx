import React, {useEffect, useState} from 'react';
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
  emptyContent?: string;
  data: any[];
  modalPosition: 'top' | 'bottom';
  isMentionModalVisible: boolean;
  loading?: boolean;
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  onPress?: (item: any) => void;
  onPressAll?: () => void;
  onChangeText?: (value: string) => void;
  onMentionText?: (textMention: string) => void;
  onContentSizeChange?: (data: any) => void;
  value?: string;
  ComponentInput?: any;
  componentInputProps?: any;
  children?: React.ReactNode;
}

const MentionInput: React.FC<MentionInputProps> = ({
  style,
  title,
  emptyContent,
  data,
  modalPosition,
  isMentionModalVisible,
  loading,
  placeholderText,
  textInputStyle,
  modalStyle,
  onPress,
  onPressAll,
  onChangeText,
  onMentionText,
  onContentSizeChange,
  value,
  ComponentInput = TextInput,
  componentInputProps = {},
  children,
}: MentionInputProps) => {
  const [mentioning, setMentioning] = useState(false);

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyles(theme, modalPosition);

  useEffect(() => {
    console.log(`\x1b[36m🐣️ MentionInput loading ${loading}\x1b[0m`);
  }, [loading]);

  const _onStartMention = () => {
    console.log(`\x1b[36m🐣️ MentionInput _onStartMention\x1b[0m`);
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
    setMentioning(isMention);
    onMentionText?.(mentionKey);
    onChangeText?.(text);
  };

  const _onPressItem = (item: any) => {
    onPress?.(item);
    setMentioning(false);
  };

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
        {loading ? (
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
        value={children ? undefined : value}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        onContentSizeChange={onContentSizeChange}
        style={textInputStyle}>
        {children}
      </ComponentInput>
      {isMentionModalVisible && mentioning && (
        <View style={[styles.containerModal, modalStyle]}>
          {!!title && (
            <Text.Subtitle style={styles.textTitle}>{title}</Text.Subtitle>
          )}
          {renderMentionAll()}
          <Divider margin={spacing.margin.small} />
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={data || []}
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
