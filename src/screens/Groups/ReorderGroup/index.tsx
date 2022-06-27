import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {IGroup} from '~/interfaces/IGroup';

export interface ReorderGroupProps {
  route?: {
    params?: {
      group: IGroup;
    };
  };
}

const ReorderGroup: FC<ReorderGroupProps> = ({route}: ReorderGroupProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const initGroup = route?.params?.group;

  console.log(
    `\x1b[34m🐣️ index ReorderGroup`,
    `${JSON.stringify(initGroup, undefined, 2)}\x1b[0m`,
  );

  return (
    <View style={styles.container}>
      <Header title={t('communities:group_structure:title_reorder_group')} />
      <Text>New Component ReorderGroup</Text>
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

export default ReorderGroup;
