import i18next from 'i18next';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import ImageUploader, { IGetFile, IUploadParam } from '~/services/imageUploader';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

export const getArticleViewMenu = (
  { isActor, articleId, navigation }: {isActor: boolean, articleId: string, navigation: any},
) => {
  const onPress = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    Store.store.dispatch(modalActions.showAlertNewFeature());
  };

  const onPressEdit = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    navigation?.navigate(articleStack.editArticle, { articleId });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'article_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('post:article_menu:edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    },
    {
      id: 2,
      testID: 'article_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:article_menu:copy_link'),
      requireIsActor: false,
      onPress,
    },
    {
      id: 3,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:article_menu:delete'),
      requireIsActor: true,
      onPress,
    },
  ];

  const result = [];
  defaultData.forEach((item: any) => {
    if ((!item.requireIsActor) || (item.requireIsActor && isActor)) {
      result.push({ ...item });
    }
  });

  return result;
};

export const uploadImage = async ({ file, dispatch, onSuccess }: {
  file: any, dispatch:any, onSuccess: (file: IGetFile) => void
}) => {
  const onError = (error) => {
    const content = typeof error === 'string' ? error : i18next.t('post:error_upload_photo_failed');
    dispatch(modalActions.showHideToastMessage({ content }));
  };

  const uploadType = 'post_image';
  const param: IUploadParam = {
    uploadType,
    file,
    onSuccess,
    onError,

  };
  try {
    await ImageUploader.getInstance().upload(param);
  } catch (error) {
    onError(error);
  }
};
