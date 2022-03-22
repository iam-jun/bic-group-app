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
  testID?: string;
  onActionPress: (action: IAction) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  style,
  isChecked = false,
  testID,
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
    <TouchableOpacity style={style} onPress={_onChangeValue} testID={testID}>
      <View testID="toggle.out_side_view" style={styles.outsideRectangle}>
        <View style={styles.insideCircle} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    outsideRectangle: {
      width: 40,
      height: 16,
      borderRadius: 12,
      alignItems: isChecked ? 'flex-end' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.success : colors.borderCard,
    },
    insideCircle: {
      width: 24,
      height: 24,
      right: 0,
      borderRadius: 12,
      backgroundColor: colors.bgHover,
    },
  });
};

export default Toggle;
