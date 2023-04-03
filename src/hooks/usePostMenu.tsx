import React from 'react';
import i18next from 'i18next';
import { isEmpty } from 'lodash';
import Clipboard from '@react-native-clipboard/clipboard';

import { Keyboard } from 'react-native';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { generateLink, LinkGeneratorTypes } from '~/utils/link';
import { IPost, IReaction } from '~/interfaces/IPost';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import { Button } from '~/baseComponents';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import ReportContent from '~/components/Report/ReportContent';
import SeriesContentModal from '~/components/series/SeriesContentModal';
import useCommonController from '~/screens/store';
import { getPostMenus, getRootGroupids } from '~/helpers/post';
import { TargetType, ReportTo } from '~/interfaces/IReport';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useModalStore from '~/store/modal';
import usePostsStore, { IPostsState } from '~/store/entities/posts';

const usePostMenu = (
  data: IPost,
  isActor: boolean,
  isPostDetail: boolean,
  handleDeletePostError: (listAudiences: string[]) => void,
) => {
  const { rootNavigation } = useRootNavigation();

  const commonActions = useCommonController((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);
  const { deletePost } = usePostsStore((state: IPostsState) => state.actions);

  if (!data) return null;

  const {
    id: postId, reactionsCount, isSaved, type, audience, actor,
  } = data;

  const groupAudience = audience?.groups || [];
  const { getAudienceListWithNoPermission } = useMyPermissionsStore((state) => state.actions);

  const audienceListWithNoPermission = getAudienceListWithNoPermission(
    groupAudience,
    PermissionKey.EDIT_POST_SETTING,
  );

  const onPressEdit = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(
      homeStack.createPost, {
        postId,
        replaceWithDetail: !isPostDetail,
      },
    );
  };

  const onPressEditSettings = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(
      homeStack.postSettings, { postId },
    );
  };

  const onPressSave = () => {
    modalActions.hideBottomList();
    if (isSaved) {
      commonActions.unsavePost(postId, type);
    } else {
      commonActions.savePost(postId, type);
    }
  };

  const onPressCopyLink = () => {
    modalActions.hideBottomList();
    Clipboard.setString(generateLink(
      LinkGeneratorTypes.POST, postId,
    ));
    modalActions.showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const onPressViewReactions = () => {
    modalActions.hideBottomList();
    const firstReact = Object.values(reactionsCount)[0] as IReaction;
    if (!!firstReact && !isEmpty(firstReact)) {
      const initReaction = Object.keys(firstReact)[0];
      const payload: IPayloadReactionDetailBottomSheet = {
        reactionsCount,
        initReaction,
        getDataParam: { target: 'POST', targetId: postId },
      };
      modalActions.showReactionDetailBottomSheet(payload);
    }
  };

  const onPressViewSeries = () => {
    modalActions.hideBottomList();

    modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: i18next.t('common:btn_view_series'),
      ContentComponent: <SeriesContentModal id={postId} />,
    });
  };

  const onPressDelete = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('post:title_delete_post'),
      content: i18next.t('post:content_delete_post'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => deletePost({
        id: postId,
        callbackError: handleDeletePostError,
      }),
    });
  };

  const onPressReport = () => {
    const rootGroupIds = getRootGroupids(audience);

    modalActions.hideBottomList();

    // in this sprint default reportTo is COMMUNITY
    modalActions.showModal({
      isOpen: true,
      ContentComponent: <ReportContent
        targetId={postId}
        targetType={TargetType.POST}
        groupIds={rootGroupIds}
        reportTo={ReportTo.COMMUNITY}
      />,
    });
  };

  const onPressReportThisMember = () => {
    modalActions.hideBottomList();

    const dataReportMember = {
      userId: actor?.id,
      reportedMember: actor,
    };

    modalActions.showModal({
      isOpen: true,
      ContentComponent: <ReportContent
        targetId={actor?.id}
        targetType={TargetType.MEMBER}
        dataReportMember={dataReportMember}
      />,
      props: {
        disableScrollIfPossible: false,
      },
    });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'post_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('post:post_menu_edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    }, {
      id: 2,
      testID: 'post_view_menu.edit_settings',
      leftIcon: 'Sliders',
      title: i18next.t('post:post_menu_edit_settings'),
      requireIsActor: true,
      shouldBeHidden: audienceListWithNoPermission.length > 0,
      onPress: onPressEditSettings,
    },
    {
      id: 3,
      testID: 'post_view_menu.save_unsave',
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(`post:post_menu_${isSaved ? 'unsave' : 'save'}`),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 4,
      testID: 'post_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 5,
      testID: 'post_view_menu.insights',
      leftIcon: 'iconReact',
      title: i18next.t('post:post_menu_view_reactions'),
      requireIsActor: false,
      requireReactionCounts: true,
      onPress: onPressViewReactions,
    },
    {
      id: 6,
      testID: 'post_view_menu.view_series',
      leftIcon: 'RectangleHistory',
      title: i18next.t('common:btn_view_series'),
      requireIsActor: false,
      onPress: onPressViewSeries,
    },
    {
      id: 7,
      testID: 'post_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('post:post_menu_delete'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
    {
      id: 8,
      testID: 'post_view_menu.report',
      leftIcon: 'Flag',
      title: i18next.t('common:btn_report_content'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: onPressReport,
    },
    {
      id: 9,
      testID: 'post_view_menu.report_this_member',
      leftIcon: 'UserXmark',
      title: i18next.t('groups:member_menu:label_report_member'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: onPressReportThisMember,
    },
  ];

  const menus = getPostMenus(defaultData, isActor, reactionsCount);

  const showMenu = () => {
    Keyboard.dismiss();
    modalActions.showBottomList({ data: menus } as BottomListProps);
  };

  return {
    showMenu,
  };
};

export default usePostMenu;
