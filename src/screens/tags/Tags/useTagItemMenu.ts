/* eslint-disable @typescript-eslint/no-unused-vars */
import i18next from 'i18next';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import { ITag } from '~/interfaces/ITag';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import useTagsControllerStore from '../store';
import useModalStore from '~/store/modal';

const useTagItemMenu = (communityId: string,
  tag: ITag) => {
  const { rootNavigation } = useRootNavigation();
  const modalActions = useModalStore((state) => state.actions);
  const actions = useTagsControllerStore((state) => state.actions);

  const onPressDelete = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('tags:delete_tag_confirm'),
      content: i18next.t('tags:do_you_want_to_delete_this_tag'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteTag(communityId, tag.id);
      },
      confirmBtnProps: { type: 'ghost' },
    });
  };

  const onPressEdit = () => {
    modalActions.hideBottomList();
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
    modalActions.showBottomList({ data: defaultData } as any);
  };

  return {
    showMenu,
  };
};

export default useTagItemMenu;
