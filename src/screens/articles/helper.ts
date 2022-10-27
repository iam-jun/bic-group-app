import i18next from 'i18next';
import { ICommentData } from '~/interfaces/IPost';
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

export const getSectionData = (listComment: ICommentData[]) => {
  const result: any[] = [];
  listComment?.forEach?.((comment, index) => {
    const item: any = {};
    const lastChildComment = comment?.child?.list || [];
    const _data
      = lastChildComment.length > 0
        ? [lastChildComment[lastChildComment.length - 1]]
        : [];
    item.comment = comment;
    item.index = index;
    item.data = _data;
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : [];
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
