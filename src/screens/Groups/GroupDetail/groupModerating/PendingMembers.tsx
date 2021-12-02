import React from 'react';
import {View, StyleSheet} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import PendingUserItem from './components/PendingUserItem';
import {ITheme} from '~/theme/interfaces';
import PendingActionAll from './components/PendingActionAll';
import NoPendingMembers from './components/NoPendingMembers';

const PendingMembers = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <ScreenWrapper testID="PendingMembers" isFullView>
      <Header title={i18next.t('settings:title_pending_members')} />
      {/* <NoPendingMembers /> */}
      <View style={{margin: 16}}>
        <PendingUserItem />
        <PendingUserItem />
      </View>
      <PendingActionAll />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({});
};

export default PendingMembers;
