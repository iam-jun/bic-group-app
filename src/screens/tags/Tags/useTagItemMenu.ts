/* eslint-disable @typescript-eslint/no-unused-vars */
import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import { ITag } from '~/interfaces/ITag';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import useTagsControllerStore from '../store';

const useTagItemMenu = (communityId: string,
  tag: ITag) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const actions = useTagsControllerStore((state) => state.actions);

  const onPressDelete = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    Store.store.dispatch(modalActions.showAlert({
      title: i18next.t('tags:delete_tag_confirm'),
      content: i18next.t('tags:do_you_want_to_delete_this_tag'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteTag(communityId, tag.id);
      },
      confirmBtnProps: { type: 'ghost' },
    }));
  };

  const onPressEdit = () => {
    Store.store.dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(tagsStack.editTag, { tag });
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
