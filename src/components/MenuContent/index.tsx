import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { IPost, PostType } from '~/interfaces/IPost';
import useMenuStore from '~/store/entities/menus';
import BottomListItem from '~/components/BottomList/BottomListItem';
import CircleSpinner from '~/baseComponents/Toggle/CircleSpinner';
import { MENU_KEYS } from './constants';
import { IconType } from '~/resources/icons';
import { useBaseHook } from '~/hooks';
import { isEmpty } from 'lodash';
import useMenuContent from './hooks/useMenuContent';
import { spacing } from '~/theme';

interface MenuContentProps {
  data: IPost,
  contentType: PostType;
  isFromDetail?: boolean,

  handleConfirmDeleteSeries?: () => void,
  handleDeletePostError?: (listAudiences: string[]) => void,  
}

const MenuContent: React.FC<MenuContentProps> = ({
  data,
  contentType,
  isFromDetail,

  handleConfirmDeleteSeries,
  handleDeletePostError,
}) => {
  const { id: contentId } = data || {};

  const { t } = useBaseHook();
  const actions = useMenuStore((state) => state.actions);
  const isLoadingGetMenu = useMenuStore((state) => state.isLoadingGetMenu);
  const menu = useMenuStore((state) => state.menus[contentId]);
  const {
    onPressEdit,
    onPressEditSettings,
    onPressSave,
    onPressCopyLink,
    onPressViewReactions,

  } = useMenuContent(
    data,
    contentType,
    isFromDetail,
    handleConfirmDeleteSeries,
    handleDeletePostError,
  );

  useEffect(() => {
    if (isEmpty(menu) || !menu) {
      actions.getMenuContent(contentId);
    }
  }, [contentId]);

  const renderItem = (keyMenu: string) => {
    switch (keyMenu) {
      case MENU_KEYS.EDIT:
        return renderMenuItem(
          keyMenu,
          'FilePen',
          t('post:post_menu_edit'),
          onPressEdit,
        );
      
      case MENU_KEYS.EDIT_SETTING:
        return renderMenuItem(
          keyMenu,
          'Sliders',
          t('common:edit_settings'),
          onPressEditSettings,
        );
      
      case MENU_KEYS.SAVE:
        console.log('menu key check: -----------', menu[keyMenu])
        return renderMenuItem(
          keyMenu,
          !menu[keyMenu] ? 'BookmarkSlash' : 'Bookmark',
          t(`post:post_menu_${!menu[keyMenu] ? 'unsave' : 'save'}`),
          () => onPressSave(!menu[keyMenu]),
          true,
        );
      
      case MENU_KEYS.COPY_LINK:
        return renderMenuItem(
          keyMenu,
          'LinkHorizontal',
          t('post:post_menu_copy'),
          onPressCopyLink,
        );

      case MENU_KEYS.VIEW_REACTIONS:
        return renderMenuItem(
          keyMenu,
          'iconReact',
          t('post:post_menu_view_reactions'),
          onPressViewReactions,
        );

      



        

      default:
        console.warn(`Menu key ${keyMenu} have not defined`);
        break;
    }
  };

  const renderMenuItem = (
    keyMenu: string,
    leftIcon: IconType,
    title: string,
    onPress: () => void,
    alwaysShow: boolean = false,
  ) => {
    if (!menu[keyMenu] && !alwaysShow) return null;
    
    return (
      <BottomListItem
        key={`menu_item_${keyMenu}`}
        testID={`menu_item_${keyMenu}`}
        leftIcon={leftIcon}
        title={title}
        onPress={onPress}
      />
    );
  };

  const renderDefaultMenu = () => {
    return <></>
  };

  const renderContent = () => {
    if (isLoadingGetMenu || !menu) {
      return (
        <View style={styles.loadingView}>
          <CircleSpinner size={24} />
        </View>
      );
    }

    // render default menu is copy link whenever api error or no data
    if (!isLoadingGetMenu && !menu) {
      return renderMenuItem(
        MENU_KEYS.COPY_LINK,
        'LinkHorizontal',
        t('post:post_menu_copy'),
        onPressCopyLink,
      );
    }

    return Object.keys(menu).map(renderItem);
  }

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

export default MenuContent;

const styles = StyleSheet.create({
  container: {

  },
  loadingView: {
    marginTop: spacing.margin.large,
  },
});
