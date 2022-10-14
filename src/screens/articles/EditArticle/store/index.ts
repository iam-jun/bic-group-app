import { IEditArticleAudience, IEditArticleData, IParamPutEditArticle } from '~/interfaces/IArticle';
import putEditArticle from '~/screens/articles/EditArticle/store/actions/putEditArticle';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface IEditArticleState extends IBaseState {
  loading: boolean;
  data: IEditArticleData;
  actions: {
    setData: (data: IEditArticleData) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setAudience: (audience: IEditArticleAudience) => void;
    setMentions: (mentions: any) => void;
    putEditArticle: (param: IParamPutEditArticle) => void;
  };
}

const initialState = {
  loading: false,
  data: {
    title: '',
    content: '',
    summary: '',
    categories: [],
    series: [],
    hashtags: [],
    audience: {
      userIds: [],
      groupIds: [],
    },
    media: {},
    setting: {
      canShare: true,
      canReact: true,
      canComment: true,
      isImportant: false,
      importantExpiredAt: null,
    },
    mentions: {},
    linkPreview: {},
  },
};

const useEditArticle = (set, get) => ({
  ...initialState,

  actions: {
    setData: (data?: IEditArticleData) => {
      set((state: IEditArticleState) => {
        state.data = data || initialState.data as IEditArticleData;
      }, 'setData');
    },
    setTitle: (title: string) => {
      set((state: IEditArticleState) => {
        state.data.title = title;
      }, 'setTitle');
    },
    setContent: (content: string) => {
      set((state: IEditArticleState) => {
        state.data.content = content;
      }, 'setContent');
    },
    setAudience: (audience?:IEditArticleAudience) => {
      set((state: IEditArticleState) => {
        state.data.audience = audience || {} as IEditArticleAudience;
      }, 'setAudience');
    },
    setMentions: (mentions?:any) => {
      set((state: IEditArticleState) => {
        state.data.mentions = mentions || {};
      }, 'setMentions');
    },
    putEditArticle: putEditArticle(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useEditArticleStore = createStore<IEditArticleState>(useEditArticle);

export default useEditArticleStore;
