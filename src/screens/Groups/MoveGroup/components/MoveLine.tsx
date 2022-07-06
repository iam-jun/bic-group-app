import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';

export interface MoveLineProps {
  style?: StyleProp<ViewStyle>;
}

const MoveLine: FC<MoveLineProps> = ({style}: MoveLineProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View>
      <View style={{position: 'absolute', top: 44, bottom: 0}}>
        <View style={styles.horizontal}>
          <View style={styles.horizontalBg} />
        </View>
        <View style={styles.vertical}>
          <View style={styles.verticalBg} />
        </View>
        <Icon
          style={{position: 'absolute', top: -8, left: -1}}
          icon={'AngleDown'}
          tintColor={colors.textInfo}
        />
      </View>
      <View style={{marginLeft: 28, marginTop: 18}}>
        <View style={styles.blueDot} />
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    blueDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textInfo,
      marginTop: spacing.margin.extraLarge,
      marginRight: spacing.margin.small,
    },
    horizontal: {
      height: 1,
      width: 16,
      marginLeft: 8,
      borderRadius: 1,
      borderWidth: 1.5,
      borderColor: colors.textInfo,
      borderStyle: 'dashed',
      zIndex: 0,
    },
    horizontalBg: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: '100%',
      height: 2,
      backgroundColor: 'white',
      zIndex: 1,
    },
    vertical: {
      height: '100%',
      width: 1,
      marginLeft: 8,
      borderRadius: 1,
      borderWidth: 1.5,
      borderColor: colors.textInfo,
      borderStyle: 'dashed',
      zIndex: 0,
    },
    verticalBg: {
      position: 'absolute',
      left: 0,
      bottom: -2,
      width: 1.5,
      height: '100%',
      backgroundColor: 'white',
      zIndex: 1,
    },
  });
};

export default MoveLine;
