import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import Text from '~/beinComponents/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  latestWork?: {
    titlePosition: string;
    company: string;
  }
}

const WorkInfo = ({ style, latestWork }: Props) => {
  if (!latestWork) return null;

  return (
    <View style={[styles.container, style]}>
      <Text.BodySMedium>
        {`${latestWork?.titlePosition} `}
        <Text.BodySMedium>{` • ${latestWork?.company}`}</Text.BodySMedium>
      </Text.BodySMedium>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default WorkInfo;
