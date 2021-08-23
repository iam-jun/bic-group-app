import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '~/components';
import {fontFamilies} from '~/theme/fonts';

const MAX_NUMBER = 99;

interface RedDotProps {
  style?: StyleProp<ViewStyle>;
  number: number;
}

// a component to display a red dot with a number inside
// use for unseen chat message or unseen notification
const RedDot: React.FC<RedDotProps> = ({style, number}: RedDotProps) => {
  return (
    <View style={[styles.dot, style]}>
      <Text style={styles.number}>
        {number > MAX_NUMBER ? MAX_NUMBER + '+' : number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    minWidth: 16,
    paddingLeft: 3,
    paddingRight: 3,
    height: 16,
    backgroundColor: '#EC2626',
    borderRadius: 8,
    textAlign: 'center',
    position: 'absolute',
    top: -7,
    left: 14,
  },
  number: {
    fontFamily: fontFamilies.SegoeSemibold,
    fontWeight: 'normal',
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 14,
  },
});

export default RedDot;
