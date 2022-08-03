import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native'
import React from 'react'
import { isEmpty } from 'lodash';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  value: string;
}

const InfoItem = ({ style, title, value }: Props) => {
  let _value = value;
  if (isEmpty(value)) _value = 'settings:text_not_set'

  return (
    <View testID="info_item" style={[styles.container, style]}>
      <Text.BodyM testID="info_item.title" useI18n>{title}</Text.BodyM>
      <Text.BodyMMedium testID="info_item.value" useI18n>
        {_value}
      </Text.BodyMMedium>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.small,
  },
})

export default InfoItem
