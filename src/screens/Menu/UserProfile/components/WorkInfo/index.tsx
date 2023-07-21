import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import Text from '~/baseComponents/Text';

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
    <View style={[styles.container, style]} testID="work_info">
      <Text.BodySMedium maxLength={45} style={styles.text}>
        { latestWork?.company}
      </Text.BodySMedium>
      <Text.BodySMedium maxLength={45} style={styles.text}>
        {latestWork?.titlePosition}
      </Text.BodySMedium>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: { textAlign: 'center' },
});

export default WorkInfo;
