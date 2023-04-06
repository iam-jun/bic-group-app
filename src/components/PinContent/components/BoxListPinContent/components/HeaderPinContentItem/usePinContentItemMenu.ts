import i18next from 'i18next';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import usePinContentStore, { UpdatePinContentParams } from '~/components/PinContent/store';
import { useBaseHook } from '~/hooks';
import { IToastMessage } from '~/interfaces/common';
import showToast from '~/store/helper/showToast';
// import { useRootNavigation } from "~/hooks/navigation";
import useModalStore from '~/store/modal';

const usePinContentItemMenu = (pinContentId: string, id) => {
  // const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const { hideBottomList, showBottomList } = useModalStore((state) => state.actions);
  const actions = usePinContentStore((state) => state.actions);

  const onUnpinSuccess = () => {
    const toast: IToastMessage = {
      content: t('pin:unpinned_successfully'),
      type: ToastType.SUCCESS,
    };

    showToast(toast);
  };

  const onPressUnpin = () => {
    hideBottomList();
    const params: UpdatePinContentParams = {
      postId: pinContentId,
      unpinGroupIds: [id],
      onSuccess: onUnpinSuccess,
    };
    actions.updatePinContent(params);
  };

  const onPressReorder = () => {
    hideBottomList();
    // rootNavigation.navigate(pinStacks.reorderItems, { groupId: id });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'pin_content_item_menu.unpin',
      title: i18next.t('pin:unpin'),
      onPress: onPressUnpin,
    },
    {
      id: 2,
      testID: 'pin_content_item_menu.reorder',
      title: i18next.t('pin:reorder'),
      onPress: onPressReorder,
    },
  ];

  const showMenu = () => {
    showBottomList({ isOpen: true, data: defaultData } as any);
  };

  return {
    showMenu,
  };
};

export default usePinContentItemMenu;
