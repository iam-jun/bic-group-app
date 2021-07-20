import React from 'react';
import {ScrollView} from 'react-native';
import {NavigationHeader, ScreenWrapper} from '~/components';
import Section1 from '~/screens/Menu/ComponentCollection/Section1';
import Section2 from '~/screens/Menu/ComponentCollection/Section2';
import Section4 from '~/screens/Menu/ComponentCollection/Section4';

const ComponentCollection = () => {
  return (
    <ScreenWrapper isFullView>
      <NavigationHeader title={'Component Collection'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section1 />
        <Section4 />
        <Section2 />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ComponentCollection;
