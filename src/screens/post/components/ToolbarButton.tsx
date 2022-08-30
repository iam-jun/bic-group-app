import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';

export interface ToolbarButtonProps {
    icon: any;
    testID: string;
    onPressIcon?: (e: any) => void;
    shouldHighlight?: boolean;
}

const ToolbarButton = ({
  icon,
  testID,
  onPressIcon,
  shouldHighlight,
}: ToolbarButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const defaultTiniColor = onPressIcon ? colors.neutral40 : colors.neutral20;
  const tintColor = !!shouldHighlight ? colors.purple50 : defaultTiniColor;
  return (
    <View style={styles.toolbarButton}>
      <Icon
        size={24}
        tintColor={tintColor}
        icon={icon}
        buttonTestID={testID}
        onPress={onPressIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
});

export default ToolbarButton;
