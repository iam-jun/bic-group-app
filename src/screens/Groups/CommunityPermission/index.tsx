import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import SystemScheme from '~/screens/Groups/CommunityPermission/components/SystemScheme';
import CommunityScheme from '~/screens/Groups/CommunityPermission/components/CommunityScheme';
import GroupScheme from '~/screens/Groups/CommunityPermission/components/GroupScheme';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';

const CommunityPermission = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {id: communityId} =
    useKeySelector(groupsKeySelector.communityDetail) || {};

  useEffect(() => {
    if (communityId) {
      dispatch(groupsActions.getSchemes({communityId}));
      dispatch(groupsActions.getCommunityScheme({communityId}));
    }

    return () => {
      dispatch(groupsActions.setSchemes());
      dispatch(groupsActions.setCommunityScheme());
    };
  }, [communityId]);

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
