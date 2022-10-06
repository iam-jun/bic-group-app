import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import SystemScheme from '~/screens/PermissionScheme/components/SystemScheme';
import GeneralScheme from '~/screens/PermissionScheme/components/GeneralScheme';
import GroupScheme from '~/screens/PermissionScheme/components/GroupScheme';
import usePermissionSchemeStore from './store';

const PermissionScheme = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actions = usePermissionSchemeStore((state) => state.actions);

  useEffect(
    () => {
      if (communityId) {
        actions.getSchemes({ communityId });
        actions.getGeneralScheme(communityId);
      }

      return () => {
        actions.resetToInitState('schemes');
        actions.resetToInitState('generalScheme');
      };
    }, [communityId],
  );

  return (
    <View style={styles.container}>
      <Header title={t('communities:permission:title_permission')} />
      <ScrollView>
        <SystemScheme />
        <GeneralScheme communityId={communityId} />
        <GroupScheme communityId={communityId} />
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
  });
};

export default PermissionScheme;
