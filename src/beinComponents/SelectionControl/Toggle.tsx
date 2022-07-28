import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import commonActions, { IAction } from '~/constants/commonActions';

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
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, checked,
  );

  useEffect(
    () => {
      setChecked(isChecked);
    }, [isChecked],
  );

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
      <View
        testID={testID ? `${testID}.out_side_view` : 'toggle.out_side_view'}
        style={styles.outsideRectangle}
      >
        <View style={styles.insideCircle} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (
  theme: ExtendedTheme, isChecked: boolean,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    outsideRectangle: {
      width: 40,
      height: 16,
      borderRadius: 12,
      alignItems: isChecked ? 'flex-end' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.success : colors.gray10,
    },
    insideCircle: {
      width: 24,
      height: 24,
      right: 0,
      borderRadius: 12,
      backgroundColor: colors.white,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: colors.gray30,
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 4,
    },
  });
};

export default Toggle;
