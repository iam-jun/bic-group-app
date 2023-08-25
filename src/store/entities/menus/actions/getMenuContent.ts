import streamApi from "~/api/StreamApi";
import { IMenuState } from "..";
import { isEmpty } from "lodash";
import { timeOut } from "~/utils/common";

const getMenuContent = (set, get) => async (contentId: string) => {
  const { actions, menus }: IMenuState = get();

  if (!contentId) return;

  if (isEmpty(menus[contentId])) {
    actions.initMenuContent(contentId);
  }

  try {
    set((state: IMenuState) => {
      state.isLoadingGetMenu = true;
    }, 'getMenuContent');

    const response = await streamApi.getMenuContent(contentId);
    await timeOut(300);

    if (response?.data) {
      actions.addOrUpdateMenus(contentId, response.data);
    }

    set((state: IMenuState) => {
      state.isLoadingGetMenu = false;
    }, 'getMenuContent success');
  } catch (error) {
    set((state: IMenuState) => {
      state.isLoadingGetMenu = false;
    }, 'getMenuContent fail');
    console.error('getMenuContent fail', error);
  }
}

export default getMenuContent;
