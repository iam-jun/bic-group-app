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
        <Button onPress={() => alert('onPress View')}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text>Button Wrap Views </Text>
            <Icon icon={'Heart'} />
          </View>
        </Button>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Text.H5>{`<Button.Primary></Button.Primary>`}</Text.H5>
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing?.margin.small,
            marginBottom: spacing?.margin.base,
            justifyContent: 'space-around',
          }}>
          <Button.Primary
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Default
          </Button.Primary>
          <Button.Primary
            color={colors.iconTint}
            onPress={() => alert('onPress')}>
            Hover
          </Button.Primary>
          <Button.Primary
            disabled
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Disabled
          </Button.Primary>
        </View>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Text.H5>{`<Button.Secondary></Button.Secondary>`}</Text.H5>
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing?.margin.small,
            marginBottom: spacing?.margin.base,
            justifyContent: 'space-around',
          }}>
          <Button.Secondary
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Default
          </Button.Secondary>
          <Button.Secondary
            color={colors.primary2}
            onPress={() => alert('onPress')}>
            Hover
          </Button.Secondary>
          <Button.Secondary
            disabled
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Disabled
          </Button.Secondary>
        </View>
        <Button.Secondary
          color={colors.primary3}
          leftIcon={'Emoji'}
          leftIconProps={{tintColor: colors.primary6}}
          rightIcon={'ArrowRight'}
          onPress={() => alert('onPress')}
          onLongPress={() => alert('onLongPress')}>
          Custom color, left, right icon
        </Button.Secondary>
        <Button.Secondary
          disabled
          color={colors.primary3}
          style={{marginTop: spacing?.margin.small}}
          leftIcon={'Emoji'}
          rightIcon={'ArrowRight'}
          onPress={() => alert('onPress')}
          onLongPress={() => alert('onLongPress')}>
          Custom color, left, right icon
        </Button.Secondary>
        <Text.Subtitle>
          text not centered because of font, designer confirmed...
        </Text.Subtitle>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Text.H5>{`<Button.BottomFixed></Button.BottomFixed>`}</Text.H5>
        <View
          style={{
            backgroundColor: colors.bgButtonPrimary,
            marginHorizontal: -12,
            paddingTop: spacing?.padding.base,
            paddingBottom: spacing?.padding.large,
          }}>
          <Button.BottomFixed
            absoluteBottom={false}
            onPress={() => alert('onPress BottomButton')}>
            Bottom Button
          </Button.BottomFixed>
        </View>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Text.H5>{`<Button.BottomSecondary>`}</Text.H5>
        <View
          style={{
            backgroundColor: colors.bgButtonPrimary,
            marginHorizontal: -12,
            paddingTop: spacing?.padding.base,
            paddingBottom: spacing?.padding.large,
          }}>
          <Button.BottomSecondary
            absoluteBottom={false}
            onPress={() => alert('onPress BottomButton')}>
            Bottom Secondary Button
          </Button.BottomSecondary>
        </View>
      </View>,
    );
  };

  return (
    <View style={{}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 1</Text.H5>
      {renderButton()}
      {renderFlashMessage()}
      {renderIcon()}
      {renderText()}
      <Button.BottomFixed
        absoluteBottom={false}
        onPress={() => alert('onPress BottomButton')}>
        Bottom Button - absoluteBottom
      </Button.BottomFixed>
    </View>
  );
};

export default Section1;
