import i18next from 'i18next';
import usePinContentStore, { UpdatePinContentParams } from '~/components/PinContent/store';
// import { useRootNavigation } from "~/hooks/navigation";
import useModalStore from '~/store/modal';

const usePinContentItemMenu = (pinContentId: string, id) => {
  // const { rootNavigation } = useRootNavigation();
  const { hideBottomList, showBottomList } = useModalStore((state) => state.actions);
  const actions = usePinContentStore((state) => state.actions);

  const onPressUnpin = () => {
    hideBottomList();
    const params: UpdatePinContentParams = {
      postId: pinContentId,
      unpinGroupIds: [id],
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
