import React, {FC} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {permissionRoleSectionHeaderHeight} from '~/theme/dimension';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import TextAnimated from '~/beinComponents/Text/TextAnimated';
import Icon from '~/beinComponents/Icon';
import spacing from '~/theme/spacing';

export interface RoleHeaderAnimatedProps {
  anchorRole?: any;
  sharedValue?: any;
  style?: StyleProp<ViewStyle>;
}

const RoleHeaderAnimated: FC<RoleHeaderAnimatedProps> = ({
  anchorRole,
  sharedValue,
}: RoleHeaderAnimatedProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const anchorRoles = Object.values(anchorRole) || [];
  const roles = anchorRoles.map((ar: any) => ar?.role);
  const anchors = anchorRoles.map((ar: any) => ar?.anchor);

  const title = useSharedValue(roles?.[0] || '');

  useDerivedValue(() => {
    let newTitle;
    for (let i = anchors.length; i >= 0; i--) {
      if (sharedValue.value > anchors[i]) {
        title.value = roles[i];
        newTitle = roles[i];
        break;
      }
    }
    title.value = newTitle;
  }, [sharedValue.value, anchors]);

  const h = permissionRoleSectionHeaderHeight + 8;
  const x = -300;

  const getRange = () => {
    const inputRange = [0];
    const outputRange = [x];
    for (let i = 0; i < anchors.length; i++) {
      if (i < anchors.length - 1) {
        inputRange.push(anchors[i]);
        inputRange.push(anchors[i]);
        inputRange.push(anchors[i + 1] - h);
        inputRange.push(anchors[i + 1] - h);
        outputRange.push(x);
        outputRange.push(0);
        outputRange.push(0);
        outputRange.push(x);
      } else if (i === anchors.length - 1) {
        inputRange.push(anchors[i]);
        inputRange.push(anchors[i]);
        outputRange.push(x);
        outputRange.push(0);
      }
    }
    inputRange.push(9999999);
    outputRange.push(0);
    return {inputRange, outputRange};
  };

  const {inputRange, outputRange} = getRange();

  const headerStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: interpolate(sharedValue.value, inputRange, outputRange),
      backgroundColor: colors.background,
    }),
    [inputRange, outputRange],
  );

  return (
    <Animated.View style={[headerStyle]}>
      <TouchableOpacity activeOpacity={1} style={styles.container}>
        <TextAnimated sharedValue={title} style={{flex: 1}} />
        {/*<Icon icon={'AngleDown'} />*/}
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: permissionRoleSectionHeaderHeight,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.base,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.bgFocus,
    },
  });
};

export default RoleHeaderAnimated;
