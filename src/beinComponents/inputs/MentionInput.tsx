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
  TextStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';

export interface MentionInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  data: any[];
  modalPosition: 'top' | 'bottom';
  isMentionModalVisible: boolean;
  placeholderText?: string;
  textInputStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  renderInput?: () => React.ReactElement;
  onPress?: (item: any) => void;
  onChangeText?: (value: string) => void;
}

const MentionInput: React.FC<MentionInputProps> = ({
  style,
  data,
  modalPosition,
  isMentionModalVisible,
  placeholderText,
  textInputStyle,
  modalStyle,
  renderInput,
  onPress,
  onChangeText,
}: MentionInputProps) => {
  const [text, setText] = useState<string>('');

  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme, modalPosition);

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onPress?.(item)}>
        <Avatar.Medium
          style={styles.avatar}
          source={item.avatar || item.icon}
        />
        <Text>{item.name || item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  const _renderDefaultInput = () => {
    return (
      <TextInput
        value={text}
        onChangeText={_onChangeText}
        placeholder={placeholderText}
        style={StyleSheet.flatten([styles.textInputWrapper, textInputStyle])}
      />
    );
  };

  return (
    <View style={StyleSheet.flatten([styles.containerWrapper, style])}>
      {isMentionModalVisible && (
        <View style={StyleSheet.flatten([styles.containerModal, modalStyle])}>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={data}
            renderItem={_renderItem}
          />
        </View>
      )}
      {renderInput ? renderInput() : _renderDefaultInput()}
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
