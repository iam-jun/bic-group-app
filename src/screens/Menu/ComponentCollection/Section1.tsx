import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import FlashMessage from '~/beinComponents/FlashMessage';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';

const Section1 = () => {
  const {spacing, colors}: ITheme = useTheme();

  const [showError, setShowError] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  const renderSection = (title: string, child: React.ReactNode) => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          {title}
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        {child}
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderText = () => {
    return renderSection(
      'Text',
      <View style={{marginHorizontal: spacing?.margin.base}}>
        <Text.H1>H1. Lorem Ipsum is simply dummy text</Text.H1>
        <Text.H2>H2. Lorem Ipsum is simply dummy text</Text.H2>
        <Text.H3>H3. Lorem Ipsum is simply dummy text</Text.H3>
        <Text.H4>H4. Lorem Ipsum is simply dummy text</Text.H4>
        <Text.H5>H5. Lorem Ipsum is simply dummy text</Text.H5>
        <Text.H6>H6. Lorem Ipsum is simply dummy text</Text.H6>
        <Text.ButtonBase>
          ButtonBase. Lorem Ipsum is simply dummy text
        </Text.ButtonBase>
        <Text.ButtonSmall>
          ButtonSmall. Lorem Ipsum is simply dummy text
        </Text.ButtonSmall>
        <Text.BodyM>BodyM. Lorem Ipsum is simply dummy text</Text.BodyM>
        <Text.Body>Body. Lorem Ipsum is simply dummy text</Text.Body>
        <Text.BodySM>BodySM. Lorem Ipsum is simply dummy text</Text.BodySM>
        <Text.BodyS>BodyS. Lorem Ipsum is simply dummy text</Text.BodyS>
        <Text.Subtitle>
          Subtitle. Lorem Ipsum is simply dummy text
        </Text.Subtitle>
      </View>,
    );
  };

  const renderFlashMessage = () => {
    return renderSection(
      'Flash Message',
      <>
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
      </>,
    );
  };

  const renderIcon = () => {
    return renderSection(
      'Icon',
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
      </View>,
    );
  };

  const renderButton = () => {
    return renderSection(
      'Button',
      <View style={{marginHorizontal: spacing?.margin.base}}>
        <Text.H5>{`<Button></Button>`}</Text.H5>
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing?.margin.small,
            marginBottom: spacing?.margin.base,
            justifyContent: 'space-around',
          }}>
          <Button
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Button
          </Button>
          <Button
            disabled
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Button Disable
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing?.margin.small,
            marginBottom: spacing?.margin.base,
            justifyContent: 'space-around',
          }}>
          <Button
            textVariant={'buttonSmall'}
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            ButtonSmall
          </Button>
          <Button
            disabled
            textVariant={'buttonSmall'}
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            ButtonSmall Disable
          </Button>
        </View>
      </View>,
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 1</Text.H5>
      {renderButton()}
      {renderText()}
      {renderFlashMessage()}
      {renderIcon()}
    </View>
  );
};

export default Section1;
