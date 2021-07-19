import React from 'react';
import {ScrollView} from 'react-native';
import {NavigationHeader, ScreenWrapper} from '~/components';
import Section1 from '~/screens/Menu/ComponentCollection/Section1';
import Section2 from '~/screens/Menu/ComponentCollection/Section2';
import Section3 from '~/screens/Menu/ComponentCollection/Section3';
import Header from '~/beinComponents/Header';

const ComponentCollection = () => {
  return (
    <ScreenWrapper isFullView>
      <Header title={'ComponentCollection'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section3 />
        <Section1 />
        <Section2 />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ComponentCollection;
