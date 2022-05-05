import {ScrollView} from 'react-native';
import React from 'react';
import InfoHeader from './InfoHeader';
import AboutContent from './AboutContent';
import JoinCancelButton from './JoinCancelButton';

const CommunityPrivateWelcome = () => {
  return (
    <ScrollView testID="private_welcome" showsVerticalScrollIndicator={false}>
      <InfoHeader />
      <JoinCancelButton />
      <AboutContent />
    </ScrollView>
  );
};

export default CommunityPrivateWelcome;
