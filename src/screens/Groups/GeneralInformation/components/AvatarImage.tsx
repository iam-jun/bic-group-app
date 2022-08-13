import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Image from '~/beinComponents/Image';

import { scaleSize } from '~/theme/dimension';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import images from '~/resources/images';
import spacing from '~/theme/spacing';

interface Props {
  testID?: string;
  onEditAvatar: () => void;
  avatar: string;
  canEditInfo: boolean;
}

const AvatarImage = ({
  testID, onEditAvatar, avatar, canEditInfo,
}: Props) => {
  const loadingAvatar = useKeySelector(groupsKeySelector.loadingAvatar);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const textColor = !loadingAvatar ? colors.purple60 : colors.gray40;

  return (
    <View testID={testID}>
      <View style={styles.avatarHeader}>
        <Text.H5 color={colors.neutral80} useI18n>
          settings:title_avatar
        </Text.H5>
        {!!canEditInfo && (
          <ButtonWrapper
            testID="avatar.button_edit"
            onPress={onEditAvatar}
            disabled={loadingAvatar}
          >
            <Text.H6 testID="avatar.text_edit" color={textColor} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        )}
      </View>
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
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    avatarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    avatar: {
      width: scaleSize(96),
      height: scaleSize(96),
      maxHeight: 125,
      maxWidth: 125,
      borderRadius: 8,
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
