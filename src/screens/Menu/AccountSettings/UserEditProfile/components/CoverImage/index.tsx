import {
  ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import Image from '~/beinComponents/Image';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import { spacing } from '~/theme';
import images from '~/resources/images';
import { scaleCoverHeight } from '~/theme/dimension';

interface Props {
  style?: StyleProp<ViewStyle>;
  url: string;
  loading: boolean;
  onPressEdit: () => void
}

const CoverImage = ({
  style, url, loading, onPressEdit,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  return (
    <View style={style}>
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:title_cover
        </Text.BodyM>
        <ButtonWrapper onPress={onPressEdit} disabled={loading}>
          <Text.H6
            testID="cover_image.edit"
            color={!loading ? colors.neutral80 : colors.gray40}
            style={styles.editBtn}
            useI18n
          >
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <View
        style={{ paddingHorizontal: spacing.padding.large }}
        testID="cover_image.image"
      >
        {!loading ? (
          <Image
            style={styles.cover}
            source={url || images.img_cover_default}
          />
        ) : (
          <View style={[styles.cover, styles.imageLoading]}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    headerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      alignItems: 'center',
    },
    imageLoading: {
      backgroundColor: colors.gray20,
      justifyContent: 'center',
    },
    editBtn: { padding: spacing.padding.small },
    cover: {
      width: '100%',
      height: scaleCoverHeight(),
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default CoverImage;
