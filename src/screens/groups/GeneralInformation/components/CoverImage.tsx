import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { scaleCoverHeight } from '~/theme/dimension';
import Image from '~/components/Image';
import images from '~/resources/images';
import spacing from '~/theme/spacing';
import InfoCard from '~/components/InfoCard';
import useGeneralInformationStore from '../store';

interface Props {
  testID?: string;
  backgroundUrl: string;
  canEditInfo: boolean;

  onEditCover: () => void;
}

const CoverImage = ({
  testID,
  backgroundUrl,
  canEditInfo,

  onEditCover,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const loadingCover = useGeneralInformationStore((state) => state.loadingCover);

  return (
    <InfoCard
      testID={testID}
      title="settings:title_cover"
      onEdit={canEditInfo ? onEditCover : undefined}
    >
      <View>
        {!loadingCover ? (
          <Image
            testID="cover.image"
            style={styles.cover}
            source={backgroundUrl || images.img_cover_default}
            usePixelWidth
          />
        ) : (
          <View
            testID="cover.loading"
            style={[styles.cover, styles.imageLoading]}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    </InfoCard>

  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.margin.large,
    },
    imageLoading: {
      backgroundColor: colors.gray20,
      justifyContent: 'center',
    },
    cover: {
      width: '100%',
      height: scaleCoverHeight(),
    },
    basicInfoList: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default CoverImage;
