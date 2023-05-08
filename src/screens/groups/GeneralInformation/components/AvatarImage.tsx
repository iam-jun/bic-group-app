import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Image from '~/components/Image';

import images from '~/resources/images';
import spacing from '~/theme/spacing';
import InfoCard from '~/components/InfoCard';
import useGeneralInformationStore from '../store';

interface Props {
  testID?: string;
  avatar: string;
  canEditInfo: boolean;

  onEditAvatar: () => void;
}

const AvatarImage = ({
  testID, avatar, canEditInfo, onEditAvatar,
}: Props) => {
  const loadingAvatar = useGeneralInformationStore((state) => state.loadingAvatar);

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <InfoCard
      testID={testID}
      title="settings:title_avatar"
      onEdit={canEditInfo ? onEditAvatar : undefined}
      style={styles.container}
    >
      <View style={styles.imageButton}>
        {!loadingAvatar ? (
          <Image
            testID="avatar.image"
            style={styles.avatar}
            source={avatar || images.img_user_avatar_default}
            usePixelWidth
          />
        ) : (
          <View
            testID="avatar.loading"
            style={[styles.avatar, styles.imageLoading]}
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
    container: {
      paddingBottom: spacing.padding.large,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: spacing.borderRadius.large,
    },
    imageButton: {
      alignItems: 'center',
    },
    imageLoading: {
      backgroundColor: colors.gray20,
      justifyContent: 'center',
    },
  });
};

export default AvatarImage;
