import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  FlatList,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import {mentionRegex} from '~/constants/commonRegex';
import {TouchableOpacity} from 'react-native-gesture-handler';
import images from '~/resources/images';

export interface MentionInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  data: any[];
  modalPosition: 'top' | 'bottom';
  isMentionModalVisible: boolean;
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  onPress?: (item: any) => void;
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
  data,
  modalPosition,
  isMentionModalVisible,
  placeholderText,
  textInputStyle,
  modalStyle,
  onPress,
  onChangeText,
  onMentionText,
  onContentSizeChange,
  value,
  ComponentInput = TextInput,
  componentInputProps = {},
  children,
}: MentionInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme, modalPosition);

  const _onChangeText = (text: string) => {
    const matches = text?.match?.(mentionRegex);
    let mentionKey = '';
    if (text && matches && matches.length > 0) {
      mentionKey = matches[matches.length - 1]?.replace('@', '');
    }
    onMentionText?.(mentionKey);
    onChangeText?.(text);
  };

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onPress?.(item)}>
        <Avatar.Medium
          style={styles.avatar}
          source={item.avatar || item.icon}
          placeholderSource={images.img_user_avatar_default}
        />
        <Text>{item.name || item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={StyleSheet.flatten([styles.containerWrapper, style])}>
      <ComponentInput
        {...componentInputProps}
        value={children ? undefined : value}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        onContentSizeChange={onContentSizeChange}
        style={textInputStyle}>
        {children}
      </ComponentInput>
      {isMentionModalVisible && (
        <View style={StyleSheet.flatten([styles.containerModal, modalStyle])}>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={data}
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
      left: '6%',
      width: '85%',
      maxWidth: 355,
      maxHeight: 236,
      borderRadius: 6,
      backgroundColor: colors.background,
      justifyContent: 'center',

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
      marginHorizontal: theme.spacing?.margin.base,
      marginVertical: theme.spacing?.margin.small,
    },
  });
};

export default MentionInput;
