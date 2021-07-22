import React, {useState} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';

interface ReactionProps {
  value: number;
  icon: any;
  selected: boolean;
  onActionPress: (action: IAction) => void;
  style?: StyleProp<ViewStyle>;
}

const Reaction: React.FC<ReactionProps> = ({
  value,
  icon,
  selected,
  onActionPress,
  style,
}: ReactionProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ITheme = useTheme();
  const styles = createStyles(theme, isSelected);

  const _onChangeValue = () => {
    const newValue = !isSelected;
    setIsSelected(newValue);

    if (newValue) {
      onActionPress(commonActions.selectEmoji as IAction);
    } else {
      onActionPress(commonActions.unselectEmoji as IAction);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={_onChangeValue}>
      <Icon icon={icon} size={12} />
      <Text.Subtitle style={styles.textInput}>{value}</Text.Subtitle>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isSelected: boolean) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: isSelected ? colors.primary2 : colors.placeholder,
      borderWidth: 1,
      borderColor: isSelected ? colors.primary6 : colors.placeholder,
      borderRadius: 6,
      paddingVertical: spacing?.padding.tiny,
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    textInput: {
      marginStart: spacing?.margin.tiny,
      color: colors.textPrimary,
    },
  });
};

export default Reaction;
