import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Image from '~/components/Image';
import images from '~/resources/images';
import { spacing } from '~/theme';
import { MAX_LENGTH } from './MenuDiscoverCommunity';

const JoinedCommunityPlaceholder = () => {
  const styles = createStyles();

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="joined_community_placeholder"
    >
      {new Array(MAX_LENGTH).fill(0).map((item, index) => (
        <Image
          key={`joined-community-placeholder-${index}`}
          source={images.img_thumbnail_default}
          style={styles.image}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.padding.large,
  },
  image: {
    width: 60,
    height: 60,
    marginHorizontal: spacing.margin.tiny,
  },
});

export default JoinedCommunityPlaceholder;
