import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useBaseHook} from '~/hooks';

export interface GroupStructureSettingsProps {
  style?: StyleProp<ViewStyle>;
}

const GroupStructureSettings: FC<GroupStructureSettingsProps> = ({
  style,
}: GroupStructureSettingsProps) => {
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:group_structure:title_group_structure_settings')}
      />
      <Text>New Component GroupStructureSettings</Text>
      <Button onPress={() => rootNavigation.navigate(groupStack.reorderGroup)}>
        Reorder
      </Button>
      <Button onPress={() => rootNavigation.navigate(groupStack.moveGroup)}>
        Move
      </Button>
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

export default GroupStructureSettings;
