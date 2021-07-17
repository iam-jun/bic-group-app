import React from 'react';

import {ScreenWrapper} from '~/components';
import Text from '~/beinComponents/Text';
import FlashMessage from '~/beinComponents/FlashMessage';

const SubscriptionGroupScreen = () => {
  return (
    <ScreenWrapper testID="SubscriptionScreen" isFullView style={{padding: 16}}>

      <FlashMessage type={'error'} onClose={() => {}}>
        {'Your account is deactived in 2 hours for requesting code too many time. Please try again later'}
      </FlashMessage>
      <FlashMessage type={'success'}>
        {'You have successfully copied'}
      </FlashMessage>
      <FlashMessage type={'warning'} onClose={() => {}}>
        {'Don’t underestimate this banner'}
      </FlashMessage>

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
