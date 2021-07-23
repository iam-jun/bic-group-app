import React, {useState} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';

interface TagProps {
  label: string;
  icon: any;
  selected: boolean;
  disabled?: boolean;
  onActionPress: (action: IAction) => void;
  style?: StyleProp<ViewStyle>;
}

const Tag: React.FC<TagProps> = ({
  label,
  icon,
  selected,
  disabled = false,
  onActionPress,
  style,
}: TagProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ITheme = useTheme();
  const styles = createStyles(theme, isSelected, disabled);

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
      disabled={disabled}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={_onChangeValue}>
      <Text.Body style={StyleSheet.flatten([styles.labelText])}>
        {label}
      </Text.Body>
      <Icon
        style={styles.icon}
        icon={icon}
        size={12}
        tintColor={disabled ? theme.colors.textDisabled : theme.colors.iconTint}
        disabled={disabled}
        onPress={() => onActionPress(commonActions.removeTag as IAction)}
      />
    </TouchableOpacity>
  );
};

const createStyles = (
  theme: ITheme,
  isSelected: boolean,
  disabled: boolean,
) => {
  const {colors, spacing} = theme;

  let _backgroundColor = colors.primary1;
  let _textColor = colors.primary7;
  let _fontWeight: '400' | '600' = '400';
  if (disabled) {
    _backgroundColor = colors.bgDisable;
    _textColor = colors.textDisabled;
  } else {
    _textColor = isSelected ? colors.primary : colors.primary7;
    _fontWeight = isSelected ? '600' : '400';
  }

  return StyleSheet.create({
    container: {
      backgroundColor: _backgroundColor,
      borderRadius: 100,
      paddingVertical: 6,
      paddingHorizontal: spacing?.padding.large,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      alignSelf: 'baseline',
    },
    labelText: {
      fontWeight: _fontWeight,
      color: _textColor,
    },
    icon: {
      marginStart: spacing?.margin.small,
    },
  });
};

export default Tag;
