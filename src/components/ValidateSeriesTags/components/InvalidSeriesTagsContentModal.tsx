import React, { FC } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';

import spacing from '~/theme/spacing';

export interface InvalidSeriesTagsContentModalProps {
  seriesNames?: string[];
  tagNames?: string[];
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const maxContentHeight = SCREEN_HEIGHT * 0.5;

const InvalidSeriesTagsContentModal: FC<InvalidSeriesTagsContentModalProps> = (
  { seriesNames, tagNames }: InvalidSeriesTagsContentModalProps,
) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const textSeriesNames = seriesNames?.join?.(', ');
  const textTagNames = tagNames?.join?.(', ');

  return (
    <View style={{ maxHeight: maxContentHeight }}>
      <ScrollView>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <Text useI18n>article:modal_invalid_series_tags:content_header</Text>
          {seriesNames?.length > 0 && (
            <View style={styles.row}>
              <Text.BodyM> • </Text.BodyM>
              <Text.BodyM style={styles.textSeries}>
                {`${t('common:text_series')}: `}
                <Text.BodyMMedium>{textSeriesNames}</Text.BodyMMedium>
              </Text.BodyM>
            </View>
          )}
          {tagNames?.length > 0 && (
            <View style={styles.row}>
              <Text.BodyM> • </Text.BodyM>
              <Text.BodyM style={styles.textTags}>
                {`${t('common:text_tags')}: `}
                <Text.BodyMMedium>{textTagNames}</Text.BodyMMedium>
              </Text.BodyM>
            </View>
          )}
          <Text style={styles.textConfirm} useI18n>article:modal_invalid_series_tags:content_confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingTop: spacing.padding.tiny,
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
  row: { flexDirection: 'row' },
  textConfirm: {
    marginTop: spacing.margin.extraLarge,
  },
  textSeries: {
    flex: 1,
    marginLeft: spacing.margin.tiny,
  },
  textTags: {
    flex: 1,
    marginLeft: spacing.margin.tiny,
  },
});

export default InvalidSeriesTagsContentModal;
