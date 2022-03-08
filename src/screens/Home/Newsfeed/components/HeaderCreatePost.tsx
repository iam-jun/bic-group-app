import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import menuActions from '~/screens/Menu/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import {ICreatePostImage, ICreatePostParams} from '~/interfaces/IPost';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import ImagePicker from '~/beinComponents/ImagePicker';
import appConfig from '~/configs/appConfig';
import modalActions, {showHideToastMessage} from '~/store/modal/actions';
import postActions from '~/screens/Post/redux/actions';
import {ISelectAudienceParams} from '~/screens/Post/PostSelectAudience/SelectAudienceHelper';
import AppPermission from '~/utils/permission';
import PermissionsPopupContent from '~/beinComponents/PermissionsPopupContent';
import {photo_permission_steps} from '~/constants/permissions';

export interface HeaderCreatePostProps {
  audience?: any;
  style?: StyleProp<ViewStyle>;
  parentWidth?: number;
  createFromGroupId?: number;
}

const HeaderCreatePost: React.FC<HeaderCreatePostProps> = ({
  audience,
  style,
  parentWidth,
  createFromGroupId,
}: HeaderCreatePostProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, dimension} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const avatar = useKeySelector('menu.myProfile.avatar');

  const draftPost = useKeySelector(postKeySelector.draft.posts) || [];
  let draftCount = draftPost?.length || 0;
  if (draftCount > 9) {
    draftCount = '9+';
  }

  useEffect(() => {
    if (!avatar && userId) {
      dispatch(menuActions.getMyProfile({userId}));
    }
  }, [avatar]);

  const navigateToCreatePost = () => {
    let screen = homeStack.createPost;
    const params: ISelectAudienceParams = {createFromGroupId};
    if (audience) {
      params.initAudience = audience;
    }
    if (!createFromGroupId) {
      screen = homeStack.postSelectAudience;
      params.isFirstStep = true;
    }
    rootNavigation.navigate(screen, params as any);
  };

  const onPressCreate = () => {
    navigateToCreatePost();
  };

  const onPressDraft = () => {
    rootNavigation.navigate(homeStack.draftPost);
  };

  const onPressImage = async () => {
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
                title={t('common:permission_photo_title')}
                description={t('common:permission_photo_description')}
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
          navigateToCreatePost();
          ImagePicker.openPickerMultiple().then(images => {
            const newImages: ICreatePostImage[] = [];
            images.map(item => {
              newImages.push({fileName: item.filename, file: item});
            });
            let newImageDraft = [...newImages];
            if (newImageDraft.length > appConfig.postPhotoLimit) {
              newImageDraft = newImageDraft.slice(0, appConfig.postPhotoLimit);
              const errorContent = t(
                'post:error_reach_upload_photo_limit',
              ).replace('%LIMIT%', appConfig.postPhotoLimit);
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
        }
      },
    );
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        parentWidth && parentWidth > dimension.maxNewsfeedWidth
          ? styles.containerForBigParent
          : {},
        style,
      ])}>
      <View style={styles.contentContainer}>
        <Avatar.Medium isRounded={true} source={avatar} />
        <TouchableOpacity
          testID={'header_create_post'}
          onPress={onPressCreate}
          style={styles.buttonContainer}>
          <Text.BodyS color={colors.textTertiary} useI18n>
            {'post:create_new_post'}
          </Text.BodyS>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <Button
          testID={'header_create_post.image'}
          style={styles.buttonSmall}
          textProps={{color: colors.textTertiary}}
          leftIcon={'Image'}
          leftIconProps={{icon: 'Image', tintColor: colors.textTertiary}}
          onPress={onPressImage}>
          <Text.BodySM useI18n color={colors.textTertiary}>
            post:button_image
          </Text.BodySM>
        </Button>
        <Button
          testID={'header_create_post.draft'}
          style={styles.buttonSmall}
          textProps={{color: colors.textTertiary}}
          leftIcon={'edit'}
          leftIconProps={{icon: 'Edit', tintColor: colors.textTertiary}}
          onPress={onPressDraft}>
          <Text.ButtonBase color={colors.textTertiary}>
            <Text.BodySM useI18n color={colors.textTertiary}>
              post:button_draft
            </Text.BodySM>
          </Text.ButtonBase>
          {draftPost?.length > 0 && (
            <View style={styles.draftContainer}>
              <Text.Subtitle color={colors.textTertiary}>
                {draftCount}
              </Text.Subtitle>
            </View>
          )}
        </Button>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerForBigParent: {
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
          borderRadius: 6,
        },
      }),
    },
    buttonContainer: {
      flex: 1,
      marginLeft: spacing?.margin.large,
      justifyContent: 'center',
    },
    buttonSmall: {
      flex: 1,
      padding: spacing.padding.small,
    },
    buttonRow: {
      marginTop: spacing.margin.large,
      flexDirection: 'row',
    },
    draftContainer: {
      minWidth: 20,
      height: 18,
      marginLeft: spacing.margin.small,
      borderRadius: spacing.borderRadius.large,
      backgroundColor: colors.borderCard,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default HeaderCreatePost;
