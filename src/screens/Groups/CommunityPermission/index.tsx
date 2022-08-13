import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import SystemScheme from '~/screens/Groups/CommunityPermission/components/SystemScheme';
import CommunityScheme from '~/screens/Groups/CommunityPermission/components/CommunityScheme';
import GroupScheme from '~/screens/Groups/CommunityPermission/components/GroupScheme';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';

const CommunityPermission = () => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail) || {};

  useEffect(
    () => {
      if (communityId) {
        dispatch(groupsActions.getSchemes({ communityId }));
        dispatch(groupsActions.getCommunityScheme({ communityId }));
      }

      return () => {
        dispatch(groupsActions.setSchemes());
        dispatch(groupsActions.setCommunityScheme());
      };
    }, [communityId],
  );

  return (
    <View style={styles.container}>
      <Header title={t('communities:permission:title_permission')} />
      <ScrollView>
        <SystemScheme />
        <CommunityScheme />
        <GroupScheme />
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

export default CommunityPermission;
