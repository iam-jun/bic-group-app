import React, {FC} from 'react';
import {StyleSheet, Text as RNText, View, TouchableOpacity} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {useBaseHook} from '~/hooks';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

export interface SeenCountsViewProps {
  onPress?: () => void;
  seenPeopleCount?: number;
}

const SeenCountsView: FC<SeenCountsViewProps> = ({
  seenPeopleCount,
  onPress,
}: SeenCountsViewProps) => {
  const {t} = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  const _onPress = () => {
    onPress?.();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => _onPress()}
        activeOpacity={1}
        testID={'seen_counts_view.touchable_opacity'}>
        <Text.H6
          color={colors.gray50}
          numberOfLines={1}
          testID={'seen_counts_view.show_text'}>
          {t('post:label_seen_by')}
          {seenPeopleCount}
        </Text.H6>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginEnd: 16,
  },
  footerButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.padding.tiny,
  },
  footerButton: {
    flex: 1,
    marginVertical: spacing.margin.small,
    marginHorizontal: spacing.margin.tiny,
  },
  draftText: {
    marginVertical: spacing.margin.small,
    marginHorizontal: spacing.margin.large,
  },
});

export default SeenCountsView;
