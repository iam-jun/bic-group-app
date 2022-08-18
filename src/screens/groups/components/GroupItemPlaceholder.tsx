import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import {
  ShineOverlay,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import { getRandomInt } from '~/utils/generator';
import spacing from '~/theme/spacing';

export interface GroupItemPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const GroupItemPlaceholder: FC<GroupItemPlaceholderProps> = ({
  style,
  disableRandom,
}: GroupItemPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Placeholder Animation={ShineOverlay} style={styles.header}>
        <PlaceholderLine
          width={disableRandom ? 50 : getRandomInt(
            50, 80,
          )}
          style={styles.marginBottomSmall}
        />
      </Placeholder>
      <Placeholder
        Animation={ShineOverlay}
        Left={(p) => <PlaceholderMedia style={[p.style, styles.avatar]} />}
        style={styles.infoContainer}
      >
        <PlaceholderLine
          width={disableRandom ? 50 : getRandomInt(
            30, 60,
          )}
          style={styles.marginBottomSmall}
        />
        <PlaceholderLine
          width={disableRandom ? 40 : getRandomInt(
            30, 50,
          )}
          style={styles.margin0}
        />
      </Placeholder>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    margin0: { marginTop: 0, marginBottom: 0 },
    marginBottomSmall: { marginBottom: spacing.margin.small },
    container: {
      backgroundColor: colors.white,
      marginBottom: spacing.margin.base,
    },
    header: {
      paddingLeft: spacing.padding.base,
      paddingTop: spacing.padding.small,
    },
    infoContainer: {
      paddingLeft: spacing.padding.base,
      paddingRight: spacing.padding.small,
      paddingBottom: spacing.padding.base,
    },
    avatar: {
      width: 36,
      height: 36,
      marginRight: 8,
    },
  });
};

export default GroupItemPlaceholder;
