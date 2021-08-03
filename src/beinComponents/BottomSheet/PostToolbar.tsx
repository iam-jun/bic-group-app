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
import {useDispatch} from 'react-redux';

import BaseBottomSheet, {
  BaseBottomSheetProps,
} from '~/beinComponents/BottomSheet/BaseBottomSheet';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

import {ITheme} from '~/theme/interfaces';
import {useCreatePost} from '~/hooks/post';
import commonActions, {IAction} from '~/constants/commonActions';
import postActions from '~/screens/Post/redux/actions';
import {useBaseHook} from '~/hooks';

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

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const createPostData = useCreatePost();
  const {important} = createPostData || {};

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

  const onToggleImportant = (action: IAction) => {
    const newImportant = {...important};
    if (action === commonActions.checkBox) {
      newImportant.active = true;
    } else {
      newImportant.active = false;
    }
    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const onSelectImportantDate = () => {
    const newImportant = {...important};

    alert('onSelectImportantDate');
    newImportant.expiresTime = '10/01/2090';

    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const onClearImportantDate = () => {
    const newImportant = {...important};
    newImportant.expiresTime = '';
    dispatch(postActions.setCreatePostImportant(newImportant));
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

  const renderImportantDate = () => {
    if (!important?.active) {
      return null;
    }

    let expireDate = '';
    if (important?.expiresTime) {
      expireDate = 'something';
    }

    return (
      <View style={styles.importantContainer}>
        <Text useI18n>post:expire_on</Text>
        {!!expireDate ? (
          <>
            <ButtonWrapper onPress={onSelectImportantDate}>
              <Text style={styles.expireDate}>{expireDate}</Text>
            </ButtonWrapper>
            <ButtonWrapper onPress={onClearImportantDate}>
              <Text.BodyM useI18n style={styles.expireClearButton}>
                common:text_clear
              </Text.BodyM>
            </ButtonWrapper>
          </>
        ) : (
          <ButtonWrapper onPress={onSelectImportantDate}>
            <Text.BodyM useI18n style={styles.expireNotSetButton}>
              common:text_not_set
            </Text.BodyM>
          </ButtonWrapper>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <PrimaryItem
          height={48}
          title={t('post:mark_as_important')}
          toggleChecked={important?.active}
          onPressToggle={onToggleImportant}
          ContentComponent={renderImportantDate()}
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
    importantContainer: {
      flexDirection: 'row',
    },
    expireDate: {
      marginLeft: spacing?.margin.tiny,
      textDecorationLine: 'underline',
    },
    expireClearButton: {
      color: colors.primary7,
      marginLeft: spacing?.margin.base,
    },
    expireNotSetButton: {
      color: colors.primary7,
      marginLeft: spacing?.margin.tiny,
    },
  });
};

export default PostToolbar;
