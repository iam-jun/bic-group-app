/* eslint-disable @typescript-eslint/no-unused-vars */
import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import { ITag } from '~/interfaces/ITag';

const useTagItemMenu = (
  tag: ITag,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  const onPressDelete = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    Store.store.dispatch(modalActions.showAlert({
      title: i18next.t('tags:delete_tag_confirm'),
      content: i18next.t('tags:do_you_want_to_delete_this_tag'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        // do something
      },
      confirmBtnProps: { type: 'ghost' },
    }));
  };

  const onPressEdit = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    // rootNavigation.navigate(seriesStack.reorderArticles, { tag });
  };

  const defaultData = [
    {
      id: 1,
      title: i18next.t('common:btn_edit'),
      onPress: onPressEdit,
    },
    {
      id: 2,
      title: i18next.t('common:btn_delete'),
      onPress: onPressDelete,
    },
  ];

  const showMenu = () => {
    dispatch(
      modalActions.showBottomList({ isOpen: true, data: defaultData } as any),
    );
  };

  return {
    showMenu,
  };
};

export default useTagItemMenu;
