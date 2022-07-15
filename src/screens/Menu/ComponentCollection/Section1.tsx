import React, {useState} from 'react';
import {View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import FlashMessage from '~/beinComponents/FlashMessage';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import NormalToastMessage from '~/beinComponents/ToastMessage/NormalToastMessage';
// import {copyDeviceToken} from '~/store/app/actions';

import SimpleToastMessage from '~/beinComponents/ToastMessage/SimpleToastMessage';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {IToastMessage} from '~/interfaces/common';
import {showHideToastMessage} from '~/store/modal/actions';
import BannerMessage from '~/beinComponents/ToastMessage/BannerMessage';
import spacing from '~/theme/spacing';

const Section1 = () => {
  const {colors}: ExtendedTheme = useTheme() as ExtendedTheme;

  const [showError, setShowError] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const dispatch = useDispatch();

  // const copyToken = async () => {
  //   dispatch(copyDeviceToken());
  // };

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
        <Text.BodyM>BodyM. Lorem Ipsum is simply dummy text</Text.BodyM>
        <Text.BodyS>BodyS. Lorem Ipsum is simply dummy text</Text.BodyS>
        {/* <Text
          useParseText
          onPressAudience={audience =>
            alert('onPressAudience: ' + JSON.stringify(audience))
          }>
        <Text>
          {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' +
            'eiusmod tempor incididunt ut labore et dolore magna aliqua. Website:' +
            'https://join.bein.global. Email: join@bein.global. Ut enim ad minim' +
            'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex' +
            'ea commodo consequat. Duis aute irure dolor in reprehenderit in' +
            'voluptate velit esse cillum dolore eu fugiat nulla pariatur.' +
            '*Excepteur sint occaecat* cupidatat non proident, sunt in culpa qui' +
            'officia deserunt mollit anim id est laborum. #BeinCoreTeam #EVOL' +
            '\n@@[u:9:Trần Nam Anh]'}
        </Text> */}
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

  const renderBannerMessage = () => {
    return renderSection(
      'Banner Message',
      <>
        <BannerMessage
          leftIcon={'WifiSlash'}
          rightText={'Refresh'}
          textProps={{useI18n: true}}
          style={{margin: 12}}
          onPressRight={() => alert('Press')}>
          You are currently offline. Please check it and try again.
        </BannerMessage>
        <BannerMessage
          type={'success'}
          leftIcon={'Check'}
          style={{margin: 12}}
          textProps={{useI18n: true}}>
          You are back online
        </BannerMessage>
      </>,
    );
  };

  const renderToastMessage = () => {
    const toastMessage: IToastMessage = {
      content: 'Giới Định Tuệ',
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };

    return renderSection(
      'Toast Message',
      <>
        <ButtonWrapper
          style={{margin: spacing?.margin.base}}
          onPress={() => dispatch(showHideToastMessage(toastMessage))}>
          Click to test popup ToastMessage
        </ButtonWrapper>
        <SimpleToastMessage
          icon={'ArrowDown'}
          textProps={{useI18n: true}}
          style={{margin: spacing?.margin.base}}>
          badge:scroll_bottom
        </SimpleToastMessage>
        {showError && (
          <NormalToastMessage
            type={'error'}
            style={{margin: spacing.margin.base}}
            rightIcon={'UserGroup'}
            rightText={'Members'}
            onPressRight={() => alert('Press')}>
            You are the last admin of the group. Set another admin before
            leaving
          </NormalToastMessage>
        )}
        {showSuccess && (
          <NormalToastMessage
            type={'success'}
            style={{margin: spacing.margin.base}}
            leftIcon={'Check'}
            rightIcon={'UserGroup'}
            rightText={'Members'}
            onPressRight={() => alert('Press')}>
            You are the last admin of the group. Set another admin before
            leaving
          </NormalToastMessage>
        )}
        {showWarning && (
          <NormalToastMessage
            type={'informative'}
            style={{margin: spacing.margin.base}}
            leftIcon={'TrashCan'}>
            You are the last admin of the group. Set another admin before
            leaving
          </NormalToastMessage>
        )}
      </>,
    );
  };

  const renderIcon = () => {
    return renderSection(
      'Icon',
      <View>
        <Icon
          icon={'Bell'}
          size={36}
          label={'Unicons Icon (Ship)'}
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
            textVariant={'buttonS'}
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            ButtonSmall
          </Button>
          <Button
            disabled
            textVariant={'buttonS'}
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            ButtonSmall Disable
          </Button>
        </View>
        <Button onPress={() => alert('onPress View')}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text>Button Wrap Views </Text>
            <Icon icon={'Bell'} />
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
            color={colors.neutral80}
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
          <Button.Secondary highEmphasis onPress={() => alert('onPress')}>
            High emphasis
          </Button.Secondary>
          <Button.Secondary
            disabled
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Disabled
          </Button.Secondary>
        </View>
        <Button.Secondary
          color={colors.purple10}
          leftIcon={'Bell'}
          leftIconProps={{icon: 'Bell', tintColor: colors.purple50}}
          rightIcon={'ArrowRight'}
          onPress={() => alert('onPress')}
          onLongPress={() => alert('onLongPress')}>
          Custom color, left, right icon
        </Button.Secondary>
        <Button.Secondary
          disabled
          color={colors.purple10}
          style={{marginTop: spacing?.margin.small}}
          leftIcon={'Emoji'}
          rightIcon={'ArrowRight'}
          onPress={() => alert('onPress')}
          onLongPress={() => alert('onLongPress')}>
          Custom color, left, right icon
        </Button.Secondary>
        <Text.BodyS>
          text not centered because of font, designer confirmed...
        </Text.BodyS>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Text.H5>{`<Button.Danger></Button.Danger>`}</Text.H5>
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing?.margin.small,
            marginBottom: spacing?.margin.base,
            justifyContent: 'space-around',
          }}>
          <Button.Danger
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Default
          </Button.Danger>
          <Button.Danger
            disabled
            onPress={() => alert('onPress')}
            onLongPress={() => alert('onLongPress')}>
            Disabled
          </Button.Danger>
        </View>
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <Divider
          style={{
            margin: spacing?.margin.base,
            paddingHorizontal: spacing?.padding.base,
          }}
        />
        <View
          style={{
            backgroundColor: colors.purple50,
            marginHorizontal: -12,
            paddingTop: spacing?.padding.base,
            paddingBottom: spacing?.padding.large,
          }}></View>
      </View>,
    );
  };

  return (
    <View style={{}}>
      {/*<Button.Primary onPress={copyToken}>Copy Device Token</Button.Primary>*/}
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 1</Text.H5>
      {renderButton()}
      {renderFlashMessage()}
      {renderToastMessage()}
      {renderBannerMessage()}
      {renderIcon()}
      {renderText()}
    </View>
  );
};

export default Section1;
