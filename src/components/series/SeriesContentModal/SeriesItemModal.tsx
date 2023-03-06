import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import Button from '~/beinComponents/Button';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface ISeriesItemModalProps {
    data: any;
    onPressItem: () => void;
}

const SeriesItemModal: React.FC<ISeriesItemModalProps> = ({
  data,
  onPressItem,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  return (
    <Button
      style={styles.container}
      onPress={onPressItem}
      testID="series_item_modal.button"
    >
      <Avatar
        variant="small"
        source={data?.coverMedia?.url}
      />
      <ViewSpacing width={spacing.margin.small} />
      <View style={styles.boxTitle}>
        <Text.BodyM
          numberOfLines={1}
          color={colors.neutral60}
        >
          { data?.title }
        </Text.BodyM>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.small,
  },
  boxTitle: {
    flex: 1,
  },
});

export default SeriesItemModal;
