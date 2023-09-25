import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { isEmpty } from 'lodash';
import { IPost, PostType } from '~/interfaces/IPost';
import useMenuStore from '~/store/entities/menus';
import BottomListItem from '~/components/BottomList/BottomListItem';
import CircleSpinner from '~/baseComponents/Toggle/CircleSpinner';
import { MENU_KEYS } from './constants';
import { useBaseHook } from '~/hooks';
import useMenuContent from './hooks/useMenuContent';
import { spacing } from '~/theme';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import { QuizStatus } from '~/interfaces/IQuiz';
import { IOptionsRenderMenu } from '~/interfaces/IMenu';
import { getEnableNotificationType, getTitleContent } from './helper';
import { getTextFromSpecificNotificationTargetType } from '~/helpers/notification';
import { isScheduledContent } from '../ScheduleContent/helper';

interface MenuContentProps {
  data: IPost,
  contentType: PostType;
  isActor: boolean,
  isFromDetail?: boolean,

  handleConfirmDeleteSeries?: () => void,
  handleDeletePostError?: (listAudiences: string[]) => void,
}

const MenuContent: React.FC<MenuContentProps> = ({
  data,
  contentType,
  isActor,
  isFromDetail,

  handleConfirmDeleteSeries,
  handleDeletePostError,
}) => {
  const {
    id: contentId,
    reactionsCount,
    audience,
    quiz,
    status,
  } = data || {};

  const { t } = useBaseHook();
  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );
  const actions = useMenuStore((state) => state.actions);
  const isLoadingGetMenu = useMenuStore((state) => state.menus[contentId]?.loading);
  const menu = useMenuStore((state) => state.menus[contentId]?.data);
  const {
    onPressEdit,
    onPressEditSettings,
    onPressSave,
    onPressCopyLink,
    onPressViewReactions,
    onPressViewSeries,
    onPressPin,
    onPressReport,
    _onPressReportThisMember,
    onPressCUDQuiz,
    onPressEditQuiz,
    onPressDeleteQuiz,
    onPressDeleteContent,
    onPressNotificationSettingContent,
  } = useMenuContent(
    data,
    contentType,
    isFromDetail,
    handleConfirmDeleteSeries,
    handleDeletePostError,
  );

  const hasReaction = reactionsCount && reactionsCount.length > 0;
  const groupAudience = audience?.groups || [];
  const audienceListCannotPinContent = getAudienceListWithNoPermission(
    groupAudience,
    [PermissionKey.FULL_PERMISSION, PermissionKey.PIN_CONTENT],
  );
  const shouldBeHiddenPinOption = audienceListCannotPinContent.length === groupAudience.length;
  const audienceListCannotCRUDPostArticle = getAudienceListWithNoPermission(
    groupAudience,
    PermissionKey.CRUD_POST_ARTICLE,
  );
  const shouldBeHiddenCreateQuizOption
    = !!quiz
    || audienceListCannotCRUDPostArticle.length > 0
    || contentType === PostType.SERIES
    || !isActor;
  const audienceListCannotEditSettings = getAudienceListWithNoPermission(
    groupAudience,
    PermissionKey.EDIT_OWN_CONTENT_SETTING,
  );
  const shouldBeHiddenEditSettingsOption = audienceListCannotEditSettings.length > 0;
  const shouldBeHiddenEditQuizOption
    = !quiz
    || quiz.status !== QuizStatus.PUBLISHED
    || audienceListCannotCRUDPostArticle.length > 0
    || !isActor;
  const shouldBeHiddenDeleteQuizOption
    = !quiz
    || audienceListCannotCRUDPostArticle.length > 0
    || !isActor;
  const isShowBorderTopDeleteQuizOption = !!quiz && quiz.status !== QuizStatus.PUBLISHED;
  const contentTargetType = getEnableNotificationType(contentType);
  const specificText
    = getTextFromSpecificNotificationTargetType(contentTargetType, menu?.[MENU_KEYS.ENABLE_NOTIFICATIONS]);
  const alwaysShowEnableNoti = contentType !== PostType.SERIES;
  const titleEditContent = getTitleContent(contentType, MENU_KEYS.EDIT);
  const titleSaveContent = getTitleContent(contentType, MENU_KEYS.SAVE, menu?.[MENU_KEYS.SAVE]);
  const titleDeleteContent = getTitleContent(contentType, MENU_KEYS.DELETE);
  const isScheduled = isScheduledContent(status);

  useEffect(() => {
    if (isEmpty(menu)) {
      actions.getMenuContent(contentId);
    }
  }, [contentId]);

  const renderMenuItem = (options: IOptionsRenderMenu) => {
    const {
      keyMenu,
      leftIcon,
      title,
      onPress,
      alwaysShow = false,
      shouldBeHidden = false,
      isShowBorderTop = false,
      isShowBorderBottom = false,
      isDanger = false,
    } = options || {};

    if (shouldBeHidden) return null;

    if (!menu[keyMenu] && !alwaysShow) return null;

    return (
      <BottomListItem
        key={`menu_item_${keyMenu}`}
        testID={`menu_item_${keyMenu}`}
        leftIcon={leftIcon}
        title={title}
        onPress={onPress}
        isShowBorderTop={isShowBorderTop}
        isShowBorderBottom={isShowBorderBottom}
        isDanger={isDanger}
      />
    );
  };

  const renderListMenu = () => (
    <ScrollView testID="menu_content.content">
      {
        renderMenuItem({
          keyMenu: MENU_KEYS.EDIT,
          leftIcon: 'FilePen',
          title: titleEditContent,
          onPress: onPressEdit,
          shouldBeHidden: !isActor,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.EDIT_SETTING,
          leftIcon: 'Sliders',
          title: t('common:edit_settings'),
          onPress: onPressEditSettings,
          alwaysShow: !shouldBeHiddenEditSettingsOption,
          shouldBeHidden: shouldBeHiddenEditSettingsOption,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.SAVE,
          leftIcon: menu[MENU_KEYS.SAVE] ? 'BookmarkSlash' : 'Bookmark',
          title: titleSaveContent,
          onPress: () => onPressSave(menu[MENU_KEYS.SAVE]),
          alwaysShow: true,
        })
      }
      {
        renderMenuItem({
          keyMenu: MENU_KEYS.COPY_LINK,
          leftIcon: 'LinkHorizontal',
          title: t('post:post_menu_copy'),
          onPress: onPressCopyLink,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.VIEW_REACTIONS,
          leftIcon: 'iconReact',
          title: t('post:post_menu_view_reactions'),
          onPress: onPressViewReactions,
          alwaysShow: hasReaction,
        })
      }
      {
        renderMenuItem({
          keyMenu: MENU_KEYS.VIEW_SERIES,
          leftIcon: 'RectangleHistory',
          title: t('common:btn_view_series'),
          onPress: onPressViewSeries,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.PIN_CONTENT,
          leftIcon: 'Thumbtack',
          title: t('common:pin_unpin'),
          onPress: onPressPin,
          alwaysShow: !shouldBeHiddenPinOption,
          shouldBeHidden: shouldBeHiddenPinOption,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.REPORT_CONTENT,
          leftIcon: 'Flag',
          title: t('common:btn_report_content'),
          onPress: onPressReport,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.REPORT_MEMBER,
          leftIcon: 'UserXmark',
          title: t('groups:member_menu:label_report_member'),
          onPress: _onPressReportThisMember,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.CREATE_QUIZ,
          leftIcon: 'BallotCheck',
          title: t('quiz:create_quiz'),
          onPress: onPressCUDQuiz,
          alwaysShow: !shouldBeHiddenCreateQuizOption,
          shouldBeHidden: shouldBeHiddenCreateQuizOption,
          isShowBorderTop: true,
          isShowBorderBottom: true,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.EDIT_QUIZ,
          leftIcon: 'FilePen',
          title: t('quiz:edit_quiz'),
          onPress: onPressEditQuiz,
          alwaysShow: !shouldBeHiddenEditQuizOption,
          shouldBeHidden: shouldBeHiddenEditQuizOption,
          isShowBorderTop: true,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.DELETE_QUIZ,
          leftIcon: 'TrashCan',
          title: t('quiz:delete_quiz'),
          onPress: onPressDeleteQuiz,
          alwaysShow: !shouldBeHiddenDeleteQuizOption,
          shouldBeHidden: shouldBeHiddenDeleteQuizOption,
          isShowBorderTop: isShowBorderTopDeleteQuizOption,
          isShowBorderBottom: true,
        })
      }
      {
        renderMenuItem({
          keyMenu: MENU_KEYS.DELETE,
          leftIcon: 'TrashCan',
          title: titleDeleteContent,
          onPress: onPressDeleteContent,
          isDanger: true,
          isShowBorderTop: isScheduled,
        })
      }
      {
        !isScheduled && renderMenuItem({
          keyMenu: MENU_KEYS.ENABLE_NOTIFICATIONS,
          leftIcon:
            menu[MENU_KEYS.ENABLE_NOTIFICATIONS] ? 'BellSlash' : 'Bell',
          title: specificText,
          onPress:
            () => onPressNotificationSettingContent(
              menu[MENU_KEYS.ENABLE_NOTIFICATIONS],
              contentTargetType,
            ),
          alwaysShow: alwaysShowEnableNoti,
          shouldBeHidden: !alwaysShowEnableNoti,
        })
      }
    </ScrollView>
  );

  const renderContent = () => {
    if (isLoadingGetMenu || isEmpty(menu)) {
      return (
        <View style={styles.loadingView}>
          <CircleSpinner size={24} />
        </View>
      );
    }

    // render default menu is copy link whenever api error or no data
    if (!isLoadingGetMenu && isEmpty(menu)) {
      return renderMenuItem({
        keyMenu: MENU_KEYS.COPY_LINK,
        leftIcon: 'LinkHorizontal',
        title: t('post:post_menu_copy'),
        onPress: onPressCopyLink,
      });
    }

    return renderListMenu();
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

export default MenuContent;

const styles = StyleSheet.create({
  container: {},
  loadingView: {
    marginTop: spacing.margin.large,
  },
});
