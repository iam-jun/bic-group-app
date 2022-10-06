import {
  ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import images from '~/resources/images';
import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import { scaleSize } from '~/theme/dimension';
import { spacing } from '~/theme';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';

interface Props {
  style?: StyleProp<ViewStyle>;
  url: string;
  loading: boolean;
  onPressEdit: () => void
}

const AvatarImage = ({
  style, url, loading, onPressEdit,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  return (
    <View style={style}>
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:title_avatar
        </Text.BodyM>
        <ButtonWrapper onPress={onPressEdit} disabled={loading}>
          <Text.H6
            testID="avatar_image.edit"
            color={!loading ? colors.neutral80 : colors.gray40}
            style={styles.editBtn}
            useI18n
          >
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <View style={styles.imageButton} testID="avatar_image.image">
        {!loading ? (
          <Avatar.XLarge
            style={styles.avatar}
            source={url || images.img_user_avatar_default}
            isRounded
          />
        ) : (
          <View style={[styles.avatar, styles.imageLoading]}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
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
    headerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      alignItems: 'center',
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    imageLoading: {
      backgroundColor: colors.gray20,
      justifyContent: 'center',
    },
    editBtn: { padding: spacing.padding.small },
  });
};

export default AvatarImage;
