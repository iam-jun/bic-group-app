import {ScrollView} from 'react-native';
import React from 'react';
import InfoHeader from './InfoHeader';
import AboutContent from './AboutContent';
import JoinCancelButton from './JoinCancelButton';

const PrivateWelcome = ({onScroll}: any) => {
  return (
    <ScrollView
      testID="private_welcome"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}>
      <InfoHeader />
      <JoinCancelButton />
      <AboutContent />
    </ScrollView>
  );
};

export default PrivateWelcome;
