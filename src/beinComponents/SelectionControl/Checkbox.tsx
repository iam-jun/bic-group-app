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
  const theme: ITheme = useTheme();
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
