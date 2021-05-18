import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Dimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

import { IObject } from "~/interfaces/common";

const width = Dimensions.get("window").width - 35;

export interface Props {
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  onPress?: () => void;
  [x: string]: any;
}

const ButtonSecondary: React.FC<Props> = (props) => {
  const { style, activeOpacity, onPress, ...restProps } = props;
  const theme: IObject<any> = useTheme();
  const styles = stylesButton(theme);
  return (
    <TouchableOpacity
      {...restProps}
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={StyleSheet.flatten([styles.touch, style && style])}
    >
      {props.children}
    </TouchableOpacity>
  );
};

ButtonSecondary.defaultProps = {
  activeOpacity: 0.8,
};

const stylesButton = (theme: IObject<any>) =>
  StyleSheet.create({
    touch: {
      height: 100,
      width: width / 2 - 34,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.spacing.borderRadius.base,
      backgroundColor: theme.dark ? theme.colors.white : theme.colors.primary,
      marginBottom: theme.spacing.margin.large,
      marginHorizontal: theme.spacing.margin.large / 2,
    },
  });

export default ButtonSecondary;
