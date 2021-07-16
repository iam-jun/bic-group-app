import React from 'react';
import {Text as TextRN} from 'react-native';
import {useDispatch} from 'react-redux';

import {ScreenWrapper} from '~/components';
import Divider from '~/components/Divider';
import ListView from '~/components/list/ListView';
import {margin} from '~/theme/spacing';
import {pinnedGroups, groups} from './dummy-data';
import BeinText from '~/beinComponents/Text';
import Text from '~/beinComponents/Text';

const SubscriptionGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ScreenWrapper testID="SubscriptionScreen" isFullView style={{padding: 16}}>
      <Text.H1>H1 Lorem Ipsum is simply dummy text</Text.H1>
      <Text.H2>H2 Lorem Ipsum is simply dummy text</Text.H2>
      <Text.H3>H3 Lorem Ipsum is simply dummy text</Text.H3>
      <Text.H4>H4 Lorem Ipsum is simply dummy text</Text.H4>
      <Text.H5>H5 Lorem Ipsum is simply dummy text</Text.H5>
      <Text.H6>H6 Lorem Ipsum is simply dummy text</Text.H6>
      <Text.BodyM>BodyM Lorem Ipsum is simply dummy text</Text.BodyM>
      <Text.Body>Body Lorem Ipsum is simply dummy text</Text.Body>
      <Text.BodySM>BodySM Lorem Ipsum is simply dummy text</Text.BodySM>
      <Text.BodyS>BodyS Lorem Ipsum is simply dummy text</Text.BodyS>
      <Text.Subtitle>Subtitle Lorem Ipsum is simply dummy text</Text.Subtitle>

      <Text style={{textDecorationLine: 'underline'}}>RN Text</Text>
    </ScreenWrapper>
  );
};

export default SubscriptionGroupScreen;
