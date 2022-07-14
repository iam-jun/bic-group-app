import React, {useRef} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import TextInput from '~/beinComponents/inputs/TextInput';
import PostToolbar from '~/screens/Post/components/PostToolbar';
import spacing from '~/theme/spacing';

const Section4 = () => {
  const baseSheetRef: any = useRef();
  const postToolbarRef: any = useRef();

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

  const renderTextInput = () => {
    return renderSection(
      'TextInput',
      <View style={{paddingHorizontal: spacing?.margin.base}}>
        <TextInput helperContent={'Input your password'} />
        <TextInput
          placeholder={'Example text'}
          value={'123456789'}
          helperContent={'Wrong email or password! '}
          helperAction={'Forgot password'}
          helperActionOnPress={() => alert('onPress forgot password')}
          error
        />
        <TextInput editable helperContent={'Input your password'} />
      </View>,
    );
  };

  const renderBottomSheet = () => {
    return renderSection(
      'BottomSheet',
      <View>
        <Text.H5
          style={{
            marginHorizontal: spacing?.margin.base,
          }}>{`<BottomSheet/>`}</Text.H5>
        <BottomSheet
          modalizeRef={baseSheetRef}
          ContentComponent={
            <View style={{marginHorizontal: spacing?.margin.base}}>
              <Text.H5 style={{marginVertical: spacing?.margin.base}}>
                Primary Type
              </Text.H5>
              <PrimaryItem
                title={'Public'}
                leftIcon={'Globe'}
                subTitle={'Group shows to everyone. Learn more'}
                onPressToggle={action => alert('onPress Toggle: ' + action)}
              />
              <PrimaryItem
                title={'Private'}
                leftIcon={'Lock'}
                subTitle={'Group’s content show to only members'}
                onPressToggle={action => alert('onPress Toggle: ' + action)}
              />
              <PrimaryItem
                title={'Public'}
                leftIcon={'EyeSlash'}
                subTitle={'This group is secret. Learn more'}
                onPressToggle={action => alert('onPress Toggle: ' + action)}
              />
            </View>
          }>
          <Button.Primary
            style={{margin: spacing?.margin.tiny, alignSelf: 'center'}}
            onPress={() => baseSheetRef.current?.open?.()}>
            Show Base Bottom Sheet
          </Button.Primary>
        </BottomSheet>

        <Text.H5
          style={{
            marginHorizontal: spacing?.margin.base,
            marginTop: spacing?.margin.base,
          }}>{`<PostToolbar/>`}</Text.H5>
        <PostToolbar modalizeRef={postToolbarRef} />
      </View>,
    );
  };

  return (
    <View style={{}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 4</Text.H5>
      {renderTextInput()}
      {renderBottomSheet()}
    </View>
  );
};

export default Section4;
