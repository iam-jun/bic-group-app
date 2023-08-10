import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Text';

const rotateByStyle = (percent, base_degrees, clockwise) => {
  let rotateBy = base_degrees;
  if (clockwise) {
    rotateBy = base_degrees + percent * 3.6;
  } else {
    rotateBy = base_degrees - percent * 3.6;
  }
  return {
    transform: [{ rotateZ: `${rotateBy}deg` }],
  };
};

const renderThirdLayer = (
  percent,
  commonStyles,
  ringColorStyle,
  ringBgColorStyle,
  clockwise,
  bgRingWidth,
  progressRingWidth,
  innerRingStyle,
  startDegrees,
) => {
  let rotation = 45 + startDegrees;
  let offsetLayerRotation = -135 + startDegrees;
  if (!clockwise) {
    rotation += 180;
    offsetLayerRotation += 180;
  }
  if (percent > 50) {
    return (
      <View
        style={[
          styles.secondProgressLayer,
          rotateByStyle(percent - 50, rotation, clockwise),
          commonStyles,
          ringColorStyle,
        ]}
      />
    );
  }
  return (
    <View
      style={[
        styles.offsetLayer,
        innerRingStyle,
        ringBgColorStyle,
        { transform: [{ rotateZ: `${offsetLayerRotation}deg` }] },
      ]}
    />
  );
};

interface CirclePercentageProps {
  percent: number,
  radius?: number,
  bgRingWidth?: number,
  progressRingWidth?: number,
  ringColor?: string,
  ringBgColor?: string,
  textFontSize?: any,
  textFontWeight?: any,
  textFontColor?: string,
  clockwise?: boolean,
  bgColor?: string,
  startDegrees?: number,
  renderCustomComponent?: () => ReactElement;
}

const CirclePercentage: React.FC<CirclePercentageProps> = ({
  percent = 0,
  radius = 24,
  bgRingWidth = 4,
  progressRingWidth = 4,
  ringColor = '#e7e7e7',
  ringBgColor = 'grey',
  textFontSize = 10,
  textFontWeight = 'bold',
  textFontColor = 'black',
  clockwise = true,
  bgColor = 'white',
  startDegrees = 0,
  renderCustomComponent,
}) => {
  const commonStyles = {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderTopWidth: progressRingWidth,
    borderLeftWidth: progressRingWidth,
    borderBottomWidth: progressRingWidth,
    borderRightWidth: progressRingWidth,
  };

  /**
   * Calculate radius for base layer and offset layer.
   * If progressRingWidth == bgRingWidth, innerRadius is equal to radius
   * */
  const widthDiff = progressRingWidth - bgRingWidth;
  const innerRadius = radius - progressRingWidth + bgRingWidth + widthDiff / 2;

  const innerRingStyle = {
    width: innerRadius * 2,
    height: innerRadius * 2,
    borderRadius: innerRadius,
    borderTopWidth: bgRingWidth,
    borderLeftWidth: bgRingWidth,
    borderBottomWidth: bgRingWidth,
    borderRightWidth: bgRingWidth,
  };

  const ringColorStyle = {
    borderRightColor: ringColor,
    borderTopColor: ringColor,
  };

  const ringBgColorStyle = {
    borderRightColor: ringBgColor,
    borderTopColor: ringBgColor,
  };

  const thickOffsetRingStyle = {
    borderRightColor: bgColor,
    borderTopColor: bgColor,
  };

  let rotation = -135 + startDegrees;
  /**
   * If we want our ring progress to be displayed in anti-clockwise direction
   * */
  if (!clockwise) {
    rotation += 180;
  }
  let firstProgressLayerStyle;
  /* when ther ring's border widths are different and percent is less than 50, then we need an offsetLayer
   * before the original offser layer to avoid ring color of the thick portion to be visible in the background.
   */
  let displayThickOffsetLayer = false;
  if (percent > 50) {
    firstProgressLayerStyle = rotateByStyle(50, rotation, clockwise);
  } else {
    firstProgressLayerStyle = rotateByStyle(percent, rotation, clockwise);
    if (progressRingWidth > bgRingWidth) {
      displayThickOffsetLayer = true;
    }
  }

  let offsetLayerRotation = -135 + startDegrees;
  if (!clockwise) {
    offsetLayerRotation += 180;
  }

  return (
    <View style={[styles.container, { width: radius * 2, height: radius * 2 }]}>
      <View
        style={[
          styles.baselayer,
          innerRingStyle,
          { borderColor: ringBgColor, borderWidth: bgRingWidth },
        ]}
      />
      {percent !== 0 && (
        <View
          style={[
            styles.firstProgressLayer,
            firstProgressLayerStyle,
            commonStyles,
            ringColorStyle,
            {
              borderTopWidth: progressRingWidth,
              borderRightWidth: progressRingWidth,
            },
          ]}
        />
      )}
      {displayThickOffsetLayer && (
        <View
          style={[
            styles.offsetLayer,
            commonStyles,
            thickOffsetRingStyle,
            {
              transform: [{ rotateZ: `${offsetLayerRotation}deg` }],
              borderWidth: progressRingWidth,
            },
          ]}
        />
      )}
      {renderThirdLayer(
        percent,
        commonStyles,
        ringColorStyle,
        ringBgColorStyle,
        clockwise,
        bgRingWidth,
        progressRingWidth,
        innerRingStyle,
        startDegrees,
      )}
      {renderCustomComponent && renderCustomComponent()}
      {!renderCustomComponent && (
        <Text
          style={[
            styles.display,
            {
              fontSize: textFontSize,
              fontWeight: textFontWeight,
              color: textFontColor,
            },
          ]}
        >
          {percent}
          %
        </Text>
      )}
    </View>
  );
};

/**
 * offsetLayer has transform:[{rotateZ: '-135deg'}] since
 * the offsetLayer rotation is fixed by us.
 * */
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baselayer: {
    position: 'absolute',
  },
  firstProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  secondProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  offsetLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  display: {
    position: 'absolute',
  },
});

export default CirclePercentage;
