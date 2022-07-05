import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';

export interface GroupSchemeAssignmentProps {
  style?: StyleProp<ViewStyle>;
}

const GroupSchemeAssignment: FC<GroupSchemeAssignmentProps> = ({
  style,
}: GroupSchemeAssignmentProps) => {
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:permission:title_group_scheme_assignment')}
      />
      <Text>New Component GroupSchemeAssignment</Text>
      <Button
        onPress={() =>
          rootNavigation.navigate(groupStack.groupSchemeAssignSelection)
        }>
        Assign
      </Button>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgHover,
    },
  });
};

export default GroupSchemeAssignment;
