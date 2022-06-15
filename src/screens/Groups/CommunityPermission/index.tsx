import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import SystemScheme from '~/screens/Groups/CommunityPermission/components/SystemScheme';
import CommunityScheme from '~/screens/Groups/CommunityPermission/components/CommunityScheme';
import GroupScheme from '~/screens/Groups/CommunityPermission/components/GroupScheme';

const CommunityPermission = () => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header title={t('communities:permission:title_permission')} />
      <SystemScheme />
      <CommunityScheme />
      <GroupScheme />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  return StyleSheet.create({
    container: {},
  });
};

export default CommunityPermission;
