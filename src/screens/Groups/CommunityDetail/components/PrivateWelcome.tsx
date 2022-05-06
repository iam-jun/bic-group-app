import {ScrollView, View} from 'react-native';
import React from 'react';
import InfoHeader from './InfoHeader';
import AboutContent from './AboutContent';
import JoinCancelButton from './JoinCancelButton';

interface PrivateWelcomeProps {
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const PrivateWelcome = ({onScroll, onButtonLayout}: PrivateWelcomeProps) => {
  return (
    <ScrollView
      testID="private_welcome"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}>
      <View onLayout={onButtonLayout}>
        <InfoHeader />
        <JoinCancelButton />
      </View>

      <AboutContent />
    </ScrollView>
  );
};

export default PrivateWelcome;
