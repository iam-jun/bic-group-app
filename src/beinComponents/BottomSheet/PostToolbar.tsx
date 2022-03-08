import React, {useRef} from 'react';
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {throttle} from 'lodash';
import {useTheme} from 'react-native-paper';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import BottomSheet from '~/beinComponents/BottomSheet/index';
import {BaseBottomSheetProps} from '~/beinComponents/BottomSheet/BaseBottomSheet';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

import {ITheme} from '~/theme/interfaces';

import postActions from '~/screens/Post/redux/actions';
import {useBaseHook} from '~/hooks';

import ImagePicker from '~/beinComponents/ImagePicker';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ICreatePostImage} from '~/interfaces/IPost';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import appConfig from '~/configs/appConfig';
import modalActions, {showHideToastMessage} from '~/store/modal/actions';
import AppPermission from '~/utils/permission';
import PermissionsPopupContent from '../PermissionsPopupContent';
import {photo_permission_steps} from '~/constants/permissions';

export interface PostToolbarProps extends BaseBottomSheetProps {
  modalizeRef: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const PostToolbar = ({
  modalizeRef,
  style,
  containerStyle,
  disabled,
  ...props
}: PostToolbarProps) => {
  const animated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const selectedImage: ICreatePostImage[] = useKeySelector(
    postKeySelector.createPost.images,
  );

  const openModal = throttle((e?: any) => {
    Keyboard.dismiss();
    modalizeRef?.current?.open?.(e?.pageX, e?.pageY);
  }, 500);

  const handleGesture = (event: GestureEvent<any>) => {
    const {nativeEvent} = event;
    if (nativeEvent.velocityY < 0) {
      openModal();
    }
  };

  const _onPressSelectImage = () => {
    modalizeRef?.current?.close?.();
    AppPermission.checkPermission(
      'photo',
      () => {
        dispatch(
          modalActions.showModal({
            isOpen: true,
            closeOutSide: false,
            useAppBottomSheet: false,
            ContentComponent: (
              <PermissionsPopupContent
                title={i18next.t('common:permission_photo_title')}
                description={i18next.t('common:permission_photo_description')}
                steps={photo_permission_steps}
                goToSetting={() => {
                  dispatch(modalActions.hideModal());
                }}
              />
            ),
          }),
        );
      },
      canOpenPicker => {
        if (canOpenPicker) {
          openGallery();
        }
      },
    );
  };

  const openGallery = () => {
    ImagePicker.openPickerMultiple().then(images => {
      const newImages: ICreatePostImage[] = [];
      images.map(item => {
        newImages.push({fileName: item.filename, file: item});
      });
      let newImageDraft = [...selectedImage, ...newImages];
      if (newImageDraft.length > appConfig.postPhotoLimit) {
        newImageDraft = newImageDraft.slice(0, appConfig.postPhotoLimit);
        const errorContent = t('post:error_reach_upload_photo_limit').replace(
          '%LIMIT%',
          appConfig.postPhotoLimit,
        );
        dispatch(
          showHideToastMessage({
            content: errorContent,
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      }
      dispatch(postActions.setCreatePostImagesDraft(newImageDraft));
      rootNavigation.navigate(homeStack.postSelectImage);
    });
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
            disabled={disabled}
            onPress={openModal}
            testID="post_toolbar">
            <Text.Subtitle style={{flex: 1}} useI18n>
              post:text_add_to_post
            </Text.Subtitle>
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
          testID="post_toolbar.add_photo"
          height={48}
          title={t('post:add_photo')}
          leftIcon={'ImagePlus'}
          leftIconProps={{
            icon: 'ImagePlus',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          onPress={_onPressSelectImage}
        />
        <PrimaryItem
          testID="post_toolbar.add_file"
          height={48}
          title={t('post:add_file')}
          leftIcon={'Link'}
          leftIconProps={{
            icon: 'Link',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          // onPress={onPressSelectFile}
        />
      </View>
    );
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      ContentComponent={renderContent()}
      panGestureAnimatedValue={animated}
      overlayStyle={{backgroundColor: 'transparent'}}
      side={'center'}
      menuMinWidth={400}
      menuMinHeight={300}
      {...props}>
      {renderToolbar()}
    </BottomSheet>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    row: {flexDirection: 'row'},
    flex1: {flex: 1},
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
