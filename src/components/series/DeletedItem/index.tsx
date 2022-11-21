import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  View, StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import Text from '~/baseComponents/Text';
import Image from '~/beinComponents/Image';
import spacing from '~/theme/spacing';
import resourceImages from '~/resources/images';
import { useBaseHook } from '~/hooks';

type DeletedItemProps = {
    style?: StyleProp<ViewStyle>;
    title?: string;
}

const DeletedItem = ({ style, title }: DeletedItemProps) => {
  const theme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const text = title || t('series:text_delete_series_success');

  return (
    <View testID="series.delete_item" style={[styles.container, style]}>
      <Image style={styles.imageDelete} source={resourceImages.img_delete} />
      <Text.H6 testID="series.label_deleted">
        {text}
      </Text.H6>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    imageDelete: { width: 35, height: 35, marginRight: spacing.margin.large },
  });
};

export default DeletedItem;
