import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Icon from '~/beinComponents/Icon';
import commonActions, {IAction} from '~/constants/commonActions';

export interface CheckboxProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  isChecked?: boolean;
  onActionPress?: (action: IAction) => void;
  checkboxTestID?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  testID,
  style,
  isChecked = false,
  onActionPress,
  checkboxTestID,
}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme, checked);
  React.useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

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
    <TouchableOpacity
      testID={checkboxTestID}
      style={style}
      onPress={_onChangeValue}>
      <View style={styles.checkbox} testID={testID}>
        <Icon icon="iconCheckbox" size={18} tintColor={theme.colors.white} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderRadius: 6,
      borderColor: isChecked ? colors.purple60 : colors.gray40,
      backgroundColor: isChecked ? colors.purple60 : colors.neutral5,
      justifyContent: 'center',
    },
  });
};

export default Checkbox;
