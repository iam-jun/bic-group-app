import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import commonActions, {IAction} from '~/constants/commonActions';
import {ITheme} from '~/theme/interfaces';

interface ToggleProps {
  style?: StyleProp<ViewStyle>;
  isChecked?: boolean;
  onActionPress: (action: IAction) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  style,
  isChecked = false,
  onActionPress,
}: ToggleProps) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: ITheme = useTheme();
  const styles = createStyles(theme, checked);

  useEffect(() => {
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
    <TouchableOpacity style={style} onPress={_onChangeValue}>
      <View style={styles.outsideRectangle}>
        <View style={styles.insideCircle} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    outsideRectangle: {
      width: 32,
      height: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isChecked ? colors.primary7 : colors.borderDisable,
      alignItems: isChecked ? 'flex-end' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.primary7 : colors.placeholder,
    },
    insideCircle: {
      width: 16,
      height: 16,
      right: 0,
      borderRadius: 12,
      backgroundColor: isChecked ? colors.background : colors.bgFocus,
    },
  });
};

export default Toggle;
