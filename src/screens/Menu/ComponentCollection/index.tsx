import React from 'react';
import {ScrollView} from 'react-native';
import {ScreenWrapper} from '~/components';
import Section1 from '~/screens/Menu/ComponentCollection/Section1';
import Section2 from '~/screens/Menu/ComponentCollection/Section2';
import Section3 from '~/screens/Menu/ComponentCollection/Section3';
import Section4 from '~/screens/Menu/ComponentCollection/Section4';
import Header from '~/beinComponents/Header';

const ComponentCollection = (): React.ReactElement => {
  return (
    <ScreenWrapper isFullView>
      <Header title={'ComponentCollection'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ComponentCollection;
