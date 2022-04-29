import {StyleSheet, View, ScrollView} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import InfoHeader from './InfoHeader';
import AboutContent from './AboutContent';

const CommunityPrivateWelcome = () => {
  const theme = useTheme() as ITheme;

  return (
    <ScrollView
      testID="community_private_welcome"
      showsVerticalScrollIndicator={false}>
      <InfoHeader />
      <AboutContent />
    </ScrollView>
  );
};

export default CommunityPrivateWelcome;

const styles = StyleSheet.create({});
