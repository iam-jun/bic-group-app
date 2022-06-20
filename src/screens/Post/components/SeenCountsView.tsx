import React, {FC} from 'react';
import {StyleSheet, Text as RNText, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import Text from '~/beinComponents/Text';

export interface SeenCountsViewProps {
  onPress?: () => void;
  seenPeopleCount?: number;
}

const SeenCountsView: FC<SeenCountsViewProps> = ({
  seenPeopleCount,
  onPress,
}: SeenCountsViewProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {colors, spacing} = theme;

  const _onPress = () => {
    onPress?.();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => _onPress()} activeOpacity={1}>
        <Text.H6 color={colors.iconTintLight} numberOfLines={1}>
          {t('post:label_seen_by')}
          {seenPeopleCount}
        </Text.H6>
      </TouchableOpacity>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
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
};

export default SeenCountsView;
