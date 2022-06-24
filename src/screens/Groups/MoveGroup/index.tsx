import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';

export interface MoveGroupProps {
  style?: StyleProp<ViewStyle>;
}

const MoveGroup: FC<MoveGroupProps> = ({style}: MoveGroupProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header title={t('communities:group_structure:title_move_group')} />
      <Text>New Component MoveGroup</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default MoveGroup;
