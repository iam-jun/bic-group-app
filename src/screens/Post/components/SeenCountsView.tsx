import React, { FC } from 'react';
import {
  StyleSheet, View, TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
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
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const _onPress = () => {
    onPress?.();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => _onPress()}
        activeOpacity={1}
        testID="seen_counts_view.touchable_opacity"
      >
        <Text.SubtitleS
          color={colors.gray50}
          numberOfLines={1}
          testID="seen_counts_view.show_text"
        >
          {t('post:label_seen_by')}
          {seenPeopleCount}
        </Text.SubtitleS>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingTop: spacing.padding.large,
    paddingBottom: spacing.padding.tiny,
    paddingHorizontal: spacing.padding.large,
  },
});

export default SeenCountsView;
