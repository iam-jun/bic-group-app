import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PostType } from '~/interfaces/IPost';
import useMenuStore from '~/store/entities/menus';
import BottomListItem from '~/components/BottomList/BottomListItem';
import CircleSpinner from '~/baseComponents/Toggle/CircleSpinner';
import { MENU_KEYS } from './constants';
import { IconType } from '~/resources/icons';
import { useBaseHook } from '~/hooks';
import { isEmpty } from 'lodash';
import useMenuContent from '~/hooks/useMenuContent';
import { spacing } from '~/theme';

interface MenuContentProps {
  contentId: string;
  contentType: PostType;
}

const MenuContent: React.FC<MenuContentProps> = ({
  contentId,
  contentType,
}) => {
  const { t } = useBaseHook();
  const actions = useMenuStore((state) => state.actions);
  const isLoadingGetMenu = useMenuStore((state) => state.isLoadingGetMenu);
  const menu = useMenuStore((state) => state.menus[contentId]);
  // const {} = useMenuContent();

  console.log('menu: -----------', menu)

  useEffect(() => {
    if (isEmpty(menu) || !menu) {
      actions.getMenuContent(contentId);
    }
  }, [contentId]);

  // create hook usemenu?

  const renderItem = (keyMenu: string) => {
    switch (keyMenu) {
      case MENU_KEYS.EDIT:
        return renderMenuItem(
          keyMenu,
          'FilePen',
          t('post:post_menu_edit'),
          () => {}
        );
      
    }
  };

  const renderMenuItem = (
    keyMenu: string,
    leftIcon: IconType,
    title: string,
    onPress: () => void,
  ) => (
    <BottomListItem
      testID={`menu_item_${keyMenu}`}
      leftIcon={leftIcon}
      title={title}
      onPress={onPress}
    />
  );

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
    marginTop: spacing.margin.small,
  },
});
