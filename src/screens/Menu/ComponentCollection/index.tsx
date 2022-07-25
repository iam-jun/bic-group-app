import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Section1 from '~/screens/Menu/ComponentCollection/Section1';
import Section2 from '~/screens/Menu/ComponentCollection/Section2';
import Section3 from '~/screens/Menu/ComponentCollection/Section3';
import Section4 from '~/screens/Menu/ComponentCollection/Section4';
import Header from '~/beinComponents/Header';
import appActions from '~/store/app/actions';

const ComponentCollection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) dispatch(appActions.setRootScreenName('component-collection'));
  }, [isFocused]);

  return (
    <ScreenWrapper isFullView>
      <Header title="ComponentCollection" />
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
