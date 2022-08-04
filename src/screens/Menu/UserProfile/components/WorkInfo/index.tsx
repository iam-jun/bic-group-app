import { StyleSheet, View } from 'react-native'
import React from 'react'
import Text from '~/beinComponents/Text';

interface Props {
    latestWork?: {
        titlePosition: string;
        company: string;
    }
}

const WorkInfo = ({ latestWork }: Props) => {
  if (!latestWork) return null;

  return (
    <View style={styles.container}>
      <Text.BodySMedium>
        {`${latestWork?.titlePosition} `}
        <Text.BodySMedium>{` • ${latestWork?.company}`}</Text.BodySMedium>
      </Text.BodySMedium>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
})

export default WorkInfo
