import React, {useRef} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Keyboard,
} from 'react-native';
import {throttle} from 'lodash';
import {useTheme} from 'react-native-paper';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';

import BaseBottomSheet, {
  BaseBottomSheetProps,
} from '~/beinComponents/BottomSheet/BaseBottomSheet';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

export interface PostToolbarProps extends BaseBottomSheetProps {
  modalizeRef: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const PostToolbar = ({
  modalizeRef,
  style,
  containerStyle,
  ...props
}: PostToolbarProps) => {
  const animated = useRef(new Animated.Value(0)).current;
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const openModal = throttle(() => {
    Keyboard.dismiss();
    modalizeRef?.current?.open?.();
  }, 500);

  const handleGesture = (event: GestureEvent<any>) => {
    const {nativeEvent} = event;
    if (nativeEvent.velocityY < 0) {
      openModal();
    }
  };

  const onPressSelectImage = () => {
    alert('select image');
  };

  const onPressSelectFile = () => {
    alert('select file');
  };

  const renderToolbarButton = (icon: any) => {
    return (
      <View style={styles.toolbarButton}>
        <Icon size={16} tintColor={colors.primary7} icon={icon} />
      </View>
    );
  };

  const renderToolbar = () => {
    return (
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={containerStyle}>
          <TouchableOpacity
            activeOpacity={1}
            style={StyleSheet.flatten([styles.toolbarStyle, style])}
            onPress={openModal}>
            <Text.Subtitle style={{flex: 1}}>Add to your post</Text.Subtitle>
            {renderToolbarButton('ImagePlus')}
            {renderToolbarButton('Link')}
          </TouchableOpacity>
          <KeyboardSpacer iosOnly />
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <PrimaryItem
          height={48}
          title={'Mark as Important'}
          onPressToggle={action => alert('onPressToggle: ' + action)}
        />
        <PrimaryItem
          height={48}
          title={'Add Photo'}
          leftIcon={'ImagePlus'}
          leftIconProps={{
            icon: 'ImagePlus',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          onPress={onPressSelectImage}
        />
        <PrimaryItem
          height={48}
          title={'Add Files'}
          leftIcon={'Link'}
          leftIconProps={{
            icon: 'Link',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          onPress={onPressSelectFile}
        />
      </View>
    );
  };

  return (
    <BaseBottomSheet
      modalizeRef={modalizeRef}
      ContentComponent={renderContent()}
      panGestureAnimatedValue={animated}
      overlayStyle={{backgroundColor: 'transparent'}}
      {...props}>
      {renderToolbar()}
    </BaseBottomSheet>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    toolbarStyle: {
      height: 52,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      paddingHorizontal: spacing?.padding.extraLarge,
      alignItems: 'center',
      flexDirection: 'row',
    },
    toolbarButton: {
      backgroundColor: colors.primary1,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
    },
    contentContainer: {
      paddingHorizontal: spacing?.padding.base,
      paddingBottom: spacing?.padding.base,
    },
  });
};

export default PostToolbar;
