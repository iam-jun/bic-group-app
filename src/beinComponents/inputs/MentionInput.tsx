import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  FlatList,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import {IUser} from '~/interfaces/IAuth';

export interface MentionInputProps extends TextInputProps {
  data: IUser[];
  modalPosition: 'top' | 'bottom';
  showModal: boolean;
  onPress?: () => void;
  onChangeText?: (value: string) => void;
  textInputStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
}

const MentionInput: React.FC<MentionInputProps> = ({
  data,
  modalPosition,
  showModal,
  textInputStyle,
  modalStyle,
  onPress,
  onChangeText,
}: MentionInputProps) => {
  const [isMentionModalVisible, setMentionModalVisible] =
    useState<boolean>(showModal);
  const [text, setText] = useState<string>('');

  const theme: ITheme = useTheme();
  const styles = createStyles(theme, modalPosition);

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  const _renderItem = ({item}: {item: IUser}) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar.Medium
            style={{
              marginHorizontal: theme.spacing?.margin.base,
              marginVertical: theme.spacing?.margin.small,
            }}
            source={item.avatarUrl}
          />
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{zIndex: 99}}>
      {isMentionModalVisible && !!text && (
        <View style={StyleSheet.flatten([styles.container, modalStyle])}>
          <FlatList data={data} renderItem={_renderItem} />
        </View>
      )}
      <TextInput
        value={text}
        onChangeText={_onChangeText}
        placeholder={'Write text to test absolute modal'}
        style={StyleSheet.flatten([styles.textInputWrapper, textInputStyle])}
      />
    </View>
  );
};

const createStyles = (theme: ITheme, position: string) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      position: 'absolute',
      [position === 'top' ? 'bottom' : 'top']: '100%',
      left: '3%',
      width: 355,
      height: 236,
      borderRadius: 6,
      backgroundColor: colors.background,

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
      width: 327,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.placeholder,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
  });
};

export default MentionInput;
