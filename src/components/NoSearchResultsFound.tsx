import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Image from '~/beinComponents/Image';
import Text from '~/baseComponents/Text';
import images from '~/resources/images';
import { spacing } from '~/theme';

interface Props {
  testID?: string
}

const NoSearchResultsFound: FC<Props> = ({ testID }) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View testID={testID || 'no_search_results'} style={styles.textNoResults}>
      <Image
        resizeMode="contain"
        style={styles.imgEmpty}
        source={images.img_empty_search_post}
      />
      <Text.BodyS
        style={styles.noResultText}
        color={theme.colors.neutral40}
        useI18n
        testID="no_search_results.no_results_text"
      >
        common:text_search_no_results
      </Text.BodyS>
    </View>
  );
};

export default NoSearchResultsFound;

const styles = StyleSheet.create({
  textNoResults: {
    alignItems: 'center',
    margin: spacing.margin.large,
  },
  imgEmpty: {
    width: 150,
    aspectRatio: 1,
  },
  noResultText: {
    textAlign: 'center',
  },
});
