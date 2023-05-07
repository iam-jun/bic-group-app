import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import resourceImages from '~/resources/images';

interface PlaceHolderRemoveContentProps {
  label: string;
}

const PlaceHolderRemoveContent: React.FC<PlaceHolderRemoveContentProps> = ({
  label,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={[styles.deletedContainer]}>
      <Image style={styles.imageDelete} source={resourceImages.img_delete} />
      <Text.H6 testID="post_view.label_deleted" useI18n>
        { label }
      </Text.H6>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    deletedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    imageDelete: { width: 35, height: 35, marginRight: spacing.margin.large },
  });
};

export default PlaceHolderRemoveContent;
