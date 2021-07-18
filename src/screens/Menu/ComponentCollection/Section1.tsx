import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import FlashMessage from '~/beinComponents/FlashMessage';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';

const Section1 = () => {
  const {spacing, colors}: ITheme = useTheme();

  const [showError, setShowError] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  const renderText = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>Text</Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <View style={{marginHorizontal: spacing?.margin.base}}>
          <Text.H1>H1. Lorem Ipsum is simply dummy text</Text.H1>
          <Text.H2>H2. Lorem Ipsum is simply dummy text</Text.H2>
          <Text.H3>H3. Lorem Ipsum is simply dummy text</Text.H3>
          <Text.H4>H4. Lorem Ipsum is simply dummy text</Text.H4>
          <Text.H5>H5. Lorem Ipsum is simply dummy text</Text.H5>
          <Text.H6>H6. Lorem Ipsum is simply dummy text</Text.H6>
          <Text.BodyM>BodyM. Lorem Ipsum is simply dummy text</Text.BodyM>
          <Text.Body>Body. Lorem Ipsum is simply dummy text</Text.Body>
          <Text.BodySM>BodySM. Lorem Ipsum is simply dummy text</Text.BodySM>
          <Text.BodyS>BodyS. Lorem Ipsum is simply dummy text</Text.BodyS>
          <Text.Subtitle>
            Subtitle. Lorem Ipsum is simply dummy text
          </Text.Subtitle>
        </View>
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderFlashMessage = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Flash Message
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        {showSuccess && (
          <FlashMessage type={'success'} onClose={() => setShowSuccess(false)}>
            You have successfully copied
          </FlashMessage>
        )}
        {showWarning && (
          <FlashMessage type={'warning'} onClose={() => setShowWarning(false)}>
            Don’t underestimate this banner
          </FlashMessage>
        )}
        {showError && (
          <FlashMessage type={'error'} onClose={() => setShowError(false)}>
            Your account is deactived in 2 hours for requesting code too many
            time. Please try again later
          </FlashMessage>
        )}
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderIcon = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>Icon</Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <View>
          <Icon
            icon={'Ship'}
            size={36}
            label={'Unicons Icon (Ship)'}
            style={{marginBottom: spacing?.margin.small}}
          />
          <Icon
            icon={'iconDiamond'}
            size={36}
            label={'Font Icon (iconDiamond)'}
            style={{marginBottom: spacing?.margin.small}}
          />
          <Icon
            icon={'iconReactionHaha'}
            size={36}
            label={'Svg Icon (iconReactionHaha)'}
          />
        </View>
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 1</Text.H5>
      {renderText()}
      {renderFlashMessage()}
      {renderIcon()}
    </View>
  );
};

export default Section1;
