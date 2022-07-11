import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  ShineOverlay,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';

import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';
import {getRandomInt} from '~/utils/generator';

export interface GroupProfilePlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
}

const GroupProfilePlaceholder: React.FC<GroupProfilePlaceholderProps> = ({
  style,
  disableRandom,
}: GroupProfilePlaceholderProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={[styles.container, style]}>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderMedia style={styles.cover} />
      </Placeholder>

      <View style={styles.groupInfoHeaderContainer}>
        <Placeholder
          Animation={ShineOverlay}
          Left={p => <PlaceholderMedia style={[p.style, styles.avatar]} />}
          style={styles.infoContainer}>
          <PlaceholderLine width={disableRandom ? 50 : getRandomInt(30, 60)} />
          <View style={styles.infoText}>
            <PlaceholderLine width={disableRandom ? 4 : getRandomInt(3, 8)} />
            <PlaceholderLine
              width={disableRandom ? 12 : getRandomInt(8, 20)}
              style={styles.marginLeft}
            />
            <PlaceholderLine
              width={disableRandom ? 10 : getRandomInt(10, 20)}
              style={styles.marginLeft}
            />
          </View>
        </Placeholder>
        <View style={styles.tabButton}>
          <PlaceholderLine
            width={disableRandom ? 25 : getRandomInt(10, 20)}
            style={styles.marginLeft}
          />
          <PlaceholderLine
            width={disableRandom ? 15 : getRandomInt(10, 20)}
            style={styles.marginLeft}
          />
          <PlaceholderLine
            width={disableRandom ? 20 : getRandomInt(10, 20)}
            style={styles.marginLeft}
          />
          <PlaceholderLine
            width={disableRandom ? 22 : getRandomInt(10, 20)}
            style={styles.marginLeft}
          />
        </View>
      </View>
    </View>
  );
};

export default GroupProfilePlaceholder;

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginBottom: spacing.margin.small,
    },
    cover: {
      borderRadius: 0,
      height: 200,
      width: '100%',
      marginTop: spacing.margin.base,
    },
    avatar: {
      width: 52,
      height: 52,
    },
    groupInfoHeaderContainer: {
      backgroundColor: colors.background,
    },
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
      alignItems: 'center',
    },
    marginLeft: {
      marginLeft: spacing.margin.small,
    },
    tabButton: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.tiny,
    },
    infoText: {flexDirection: 'row'},
  });
};
