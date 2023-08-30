import React from "react";
import i18next from "i18next";
import streamApi from "~/api/StreamApi";
import { act, fireEvent, renderWithRedux, waitFor } from "~/test/testUtils";
import MenuContent from ".";
import useMenuStore from "~/store/entities/menus";
import { postWithQuiz, articleWithQuiz, mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import { seriesDetail } from '~/test/mock_data/series';
import { MENU_CONTENT } from '~/test/mock_data/menu';
import { PostType } from "~/interfaces/IPost";
import * as navigationHook from '~/hooks/navigation';
import homeStack from "~/router/navigator/MainStack/stacks/homeStack/stack";
import articleStack from "~/router/navigator/MainStack/stacks/articleStack/stack";
import seriesStack from "~/router/navigator/MainStack/stacks/series/stack";
import useMyPermissionsStore from "~/store/permissions";
import { PermissionKey } from "~/constants/permissionScheme";
import useModalStore from "~/store/modal";
import quizStack from "~/router/navigator/MainStack/stacks/quizStack/stack";

describe("MenuContent component", () => {
  const doMockPermissionsPost = () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          '18508ac3-2bfc-4172-b071-1d67f1b1e05b': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
          'aeab68c2-bcec-4edb-a78b-60c0ee90afd7': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
          'b01fb58e-9299-4a0e-a55f-9839293fb42a': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
        },
      },
    }));
  };

  const doMockPermissionsArticle = () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d': [
            PermissionKey.CRUD_POST_ARTICLE,
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
        },
      },
    }));
  };

  const doMockPermissionsSeries = () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
            PermissionKey.FULL_PERMISSION,
            PermissionKey.PIN_CONTENT,
          ],
        },
      },
    }));
  };

  it("renders correctly with type POST", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const content = rendered.getByTestId("menu_content.content");
    expect(content).toBeDefined();
  });

  it("renders correctly with type ARTICLE", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.ARTICLE}
        isActor={true}
      />
    );

    const content = rendered.getByTestId("menu_content.content");
    expect(content).toBeDefined();
  });

  it("renders correctly with type SERIES", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const content = rendered.getByTestId("menu_content.content");
    expect(content).toBeDefined();
  });

  it("should call getMenuContent success", () => {
    jest.useFakeTimers();

    const response = {
      code: "api.ok",
      data: MENU_CONTENT,
      meta: {
       message: "Get menu settings successfully",
      },
    }

    const spyGetMenuContent = jest.spyOn(streamApi, 'getMenuContent').mockImplementation(
      () => Promise.resolve(response),
    );
    
    renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    expect(spyGetMenuContent).toBeCalled();
    expect(useMenuStore.getState().menus[postWithQuiz.data.id].data).toEqual(MENU_CONTENT);
  });

  it("should call getMenuContent error", () => {
    jest.useFakeTimers();

    const error = 'internal error';

    const spyGetMenuContent = jest.spyOn(streamApi, 'getMenuContent').mockImplementation(
      () => Promise.reject(error) as any,
    );
    
    renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    expect(spyGetMenuContent).toBeCalled();
    expect(useMenuStore.getState().menus[postWithQuiz.data.id].data).toBeFalsy();
  });

  it("should not call getMenuContent when data empty", () => {
    jest.useFakeTimers();

    const error = 'internal error';

    const spyGetMenuContent = jest.spyOn(streamApi, 'getMenuContent').mockImplementation(
      () => Promise.reject(error) as any,
    );
    
    renderWithRedux(
      <MenuContent
        data={{} as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    expect(spyGetMenuContent).not.toBeCalled();
  });

  it("should navigate EditPost", () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEdit");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(homeStack.createPost, {
      postId: postWithQuiz.data.id,
      replaceWithDetail: true,
    });
  });

  it("should navigate EditArticle", () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[articleWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={articleWithQuiz.data as any} 
        contentType={PostType.ARTICLE}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEdit");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(articleStack.createArticle, {
      articleId: articleWithQuiz.data.id,
    });
  });

  it("should navigate EditSeries", () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[seriesDetail.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={seriesDetail.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEdit");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(seriesStack.createSeries, {
      seriesId: seriesDetail.data.id,
    });
  });

  it("should navigate EditSettingPost", () => {
    doMockPermissionsPost();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEditSetting");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(homeStack.postSettings, {
      postId: postWithQuiz.data.id,
      isFromPostMenuSettings: true,
    });
  });

  it("should navigate EditSettingArticle", () => {
    doMockPermissionsArticle();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[articleWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={articleWithQuiz.data as any} 
        contentType={PostType.ARTICLE}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEditSetting");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(articleStack.createArticleSettings, {
      articleId: articleWithQuiz.data.id,
      isFromArticleMenuSettings: true,
    });
  });

  it("should navigate EditSettingSeries", () => {
    doMockPermissionsSeries();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[seriesDetail.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={seriesDetail.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const editMenu = rendered.getByTestId("menu_item_canEditSetting");  

    expect(editMenu).toBeDefined();
    fireEvent.press(editMenu);
    expect(navigate).toBeCalledWith(seriesStack.seriesSettings, {
      seriesId: seriesDetail.data.id,
      isFromSeriesMenuSettings: true,
    });
  });

  it("should save content", () => {
    const NEW_MENU_CONTENT = { ...MENU_CONTENT, isSave: false };

    const commonActions = {
      savePost: jest.fn(),
    };
    const actual = jest.requireActual('~/screens/store');
    jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);

    useMenuStore.setState((state) => {
      state.menus[seriesDetail.data.id] = {
        loading: false,
        data: NEW_MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={seriesDetail.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const saveContent = rendered.getByTestId("menu_item_isSave");  

    expect(saveContent).toBeDefined();
    fireEvent.press(saveContent);
    expect(commonActions.savePost).toBeCalled();
  });

  it("should unSave content", () => {
    const commonActions = {
      unsavePost: jest.fn(),
    };
    const actual = jest.requireActual('~/screens/store');
    jest.spyOn(actual, 'default').mockReturnValueOnce(commonActions);

    useMenuStore.setState((state) => {
      state.menus[seriesDetail.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={seriesDetail.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const unSaveContent = rendered.getByTestId("menu_item_isSave");  

    expect(unSaveContent).toBeDefined();
    fireEvent.press(unSaveContent);
    expect(commonActions.unsavePost).toBeCalled();
  });

  it("should copyLink content", () => {
    useMenuStore.setState((state) => {
      state.menus[seriesDetail.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={seriesDetail.data as any} 
        contentType={PostType.SERIES}
        isActor={true}
      />
    );

    const copyContent = rendered.getByTestId("menu_item_canCopyLink");  

    expect(copyContent).toBeDefined();
    fireEvent.press(copyContent);
    expect(useModalStore.getState().toast.content).toBe(
      'common:text_link_copied_to_clipboard',
    );
  });

  it("should viewReactions content", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const viewReactions = rendered.getByTestId("menu_item_canViewReactions");  

    expect(viewReactions).toBeDefined();
    fireEvent.press(viewReactions);
    expect(
      useModalStore.getState().reactionDetailBottomSheet.isOpen,
    ).toBeTruthy();
  });

  it("should ViewSeries content", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const viewSeries = rendered.getByTestId("menu_item_canViewSeries");  

    expect(viewSeries).toBeDefined();
    fireEvent.press(viewSeries);
    expect(useModalStore.getState().modal.titleFullScreen).toBe(
      i18next.t('common:btn_view_series'),
    );
  });

  it("should pin content", () => {
    doMockPermissionsPost();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const pin = rendered.getByTestId("menu_item_canPinContent");  

    expect(pin).toBeDefined();
    fireEvent.press(pin);
    expect(navigate).toBeCalledWith(homeStack.pinContent, {
      postId: postWithQuiz.data.id,
    });
  });

  it("should report content", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const report = rendered.getByTestId("menu_item_canReportContent");  

    expect(report).toBeDefined();
    fireEvent.press(report);
    expect(useModalStore.getState().modal.isOpen).toBeTruthy();
  });

  it("should report member", () => {
    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const report = rendered.getByTestId("menu_item_canReportMember");  

    expect(report).toBeDefined();
    fireEvent.press(report);
    expect(useModalStore.getState().modal.isOpen).toBeTruthy();
  });

  it("should create quiz", () => {
    const { quiz, ...postNoQuiz } = postWithQuiz.data;
    doMockPermissionsPost();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[postNoQuiz.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postNoQuiz as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const createQuiz = rendered.getByTestId("menu_item_canCreateQuiz");  

    expect(createQuiz).toBeDefined();
    fireEvent.press(createQuiz);
    expect(navigate).toBeCalledWith(quizStack.entryQuiz, {
      postId: postWithQuiz.data.id,
    });
  });
  
  it("should edit quiz", async () => {
    doMockPermissionsPost();

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
        () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const editQuiz = rendered.getByTestId("menu_item_canEditQuiz");  

    expect(editQuiz).toBeDefined();
    fireEvent.press(editQuiz);

    act(() => {
      useModalStore.getState().alert.onConfirm();
    });

    await waitFor(() => {
      expect(navigate).toBeCalled();
    });
  });

  it("should delete quiz", async () => {
    doMockPermissionsPost();

    const mockQuizAction = {
      deleteQuiz: jest.fn(),
    };
    const actual = jest.requireActual('~/store/entities/quizzes');
    jest.spyOn(actual, 'default').mockReturnValueOnce(mockQuizAction);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    useMenuStore.setState((state) => {
      state.menus[postWithQuiz.data.id] = {
        loading: false,
        data: MENU_CONTENT,
      };

      return state;
    });

    const rendered = renderWithRedux(
      <MenuContent
        data={postWithQuiz.data as any} 
        contentType={PostType.POST}
        isActor={true}
      />
    );

    const deleteQuiz = rendered.getByTestId("menu_item_canDeleteQuiz");  

    expect(deleteQuiz).toBeDefined();
    fireEvent.press(deleteQuiz);

    act(() => {
      useModalStore.getState().alert.onConfirm();
    });

    await waitFor(() => {
      expect(mockQuizAction.deleteQuiz).toBeCalled();
    });
  });
});
