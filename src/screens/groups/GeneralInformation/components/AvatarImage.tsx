import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Image from '~/beinComponents/Image';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import images from '~/resources/images';
import spacing from '~/theme/spacing';
import InfoCard from '~/components/InfoCard';

interface Props {
  testID?: string;
  avatar: string;
  canEditInfo: boolean;

  onEditAvatar: () => void;
}

const AvatarImage = ({
  testID, avatar, canEditInfo, onEditAvatar,
}: Props) => {
  const loadingAvatar = useKeySelector(groupsKeySelector.loadingAvatar);

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
      width: 145,
      height: 145,
      borderRadius: spacing.borderRadius.small,
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
