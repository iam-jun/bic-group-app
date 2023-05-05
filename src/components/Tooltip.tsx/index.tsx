import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { isEmpty } from 'lodash';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useTooltip from './stores';
import { dimension } from '~/theme';

interface Props {
  isDown?: boolean;
  screenId: string;
}

enum TooltipType {
  Up = 'up',
  Down = 'down',
  Right = 'right',
  Left = 'left',
}

const TRIANGLE_HEIGHT = 6;

const Tooltip = ({ isDown = false, screenId }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const viewPosition = useTooltip((state) => state.allScreen[screenId]?.position || {});
  const isShow = useTooltip((state) => state.allScreen[screenId]?.isShow || false);
  const actions = useTooltip((state) => state.actions);

  const [contentWidth, setContentWidth] = useState(0);
  let type = isDown ? TooltipType.Down : TooltipType.Up;

  if (isEmpty(viewPosition)) return null;

  const hideTooltip = () => {
    actions.hideTooltip(screenId);
  };

  const gapPoint = dimension.deviceWidth - viewPosition.x;
  const isTriangleY = gapPoint >= spacing.margin.large;
  let newTriangleX = 0;
  let newContentX = 0;
  if (isTriangleY) {
    const expectedX = viewPosition.x - viewPosition.width / 2 - contentWidth / 2;
    const expectedMarginRight = dimension.deviceWidth - (expectedX + contentWidth);
    if (expectedMarginRight >= spacing.margin.large) {
      newContentX = viewPosition.x - contentWidth / 2;
    } else {
      newContentX = dimension.deviceWidth - spacing.margin.large - contentWidth;
    }
    const currentTriangleX = newContentX + contentWidth / 2 + TRIANGLE_HEIGHT / 2;
    if (currentTriangleX !== viewPosition.x) {
      type = isDown ? TooltipType.Down : TooltipType.Up;
      newTriangleX = viewPosition.x - viewPosition.width / 2 - newContentX - contentWidth / 2;
    }
  } else {
    type = TooltipType.Right;
    newContentX = viewPosition.x - contentWidth - viewPosition.width;
  }

  const style = styles[type] || {};

  return (
    <TouchableOpacity
      onPress={hideTooltip}
      style={[styles.container, isShow ? styles.showContainer : {}]}
    >
      <Animated.View
        style={[{
          position: 'absolute',
          alignItems: 'center',
          transform: [
            { translateX: newContentX },
            { translateY: viewPosition.y },
          ],
        },
        style,
        ]}
        onLayout={(event: any) => {
          setContentWidth(event?.nativeEvent?.layout?.width);
        }}
      >
        {type === TooltipType.Down && (
        <View style={[styles.triangleUp,
          { transform: [{ translateX: newTriangleX }, { rotate: '180deg' }] }]}
        />
        )}
        <View style={styles.tooltipText}>
          <Text.BodyS
            useI18n
            testID="user_profile.tooltip"
            color={colors.white}
          >
            settings:toast_profile_is_verified
          </Text.BodyS>
        </View>
        { type === TooltipType.Up
        && <View style={[styles.triangleUp, { transform: [{ translateX: newTriangleX }] }]} /> }
        {type === TooltipType.Right
        && <View style={[styles.triangleUp, styles.triangleLeft]} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    showContainer: {
      position: 'absolute',
      zIndex: 2,
    },
    triangleUp: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: TRIANGLE_HEIGHT,
      borderRightWidth: TRIANGLE_HEIGHT,
      borderBottomWidth: 0,
      borderTopWidth: TRIANGLE_HEIGHT,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.neutral80,
      borderTopColor: colors.neutral80,
    },
    triangleLeft: {
      transform: [{ rotate: '270deg' }],
      marginLeft: -spacing.margin.tiny,
    },
    triangleRight: {
      transform: [{ rotate: '90deg' }],
      marginLeft: spacing.margin.tiny,
    },
    tooltipText: {
      backgroundColor: colors.neutral80,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: 4,
    },
    row: {
      flexDirection: 'row',
    },
    up: {
      top: -30,
    },
    down: {
      top: 30,
    },
    right: {
      flexDirection: 'row',
    },
    left: {
      flexDirection: 'row',
    },
  });
};

export default Tooltip;
