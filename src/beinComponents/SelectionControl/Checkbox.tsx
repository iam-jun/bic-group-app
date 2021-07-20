import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import commonActions, {IAction} from '~/constants/commonActions';
import {ITheme} from '~/theme/interfaces';

interface CheckboxProps {
  style?: StyleProp<ViewStyle>;
  isChecked?: boolean;
  onActionPress: (action: IAction) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  style,
  isChecked = false,
  onActionPress,
}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: ITheme = useTheme();
  const styles = createStyles(theme, checked);

  const _onChangeValue = () => {
    const newValue = !checked;
    setChecked(newValue);

    if (newValue) {
      onActionPress(commonActions.checkBox as IAction);
    } else {
      onActionPress(commonActions.uncheckBox as IAction);
    }
  };

  return (
    <TouchableOpacity style={style} onPress={_onChangeValue}>
      <View style={styles.checkbox}>
        <Icon
          icon="iconCheckbox"
          size={18}
          tintColor={theme.colors.background}
        />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderRadius: 6,
      borderColor: isChecked ? colors.primary7 : colors.borderDisable,
      backgroundColor: isChecked ? colors.primary7 : colors.placeholder,
      justifyContent: 'center',
    },
  });
};

export default Checkbox;
