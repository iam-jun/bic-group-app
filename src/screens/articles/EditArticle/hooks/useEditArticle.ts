import { isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { IEditArticleAudience, IEditArticleData, IParamPutEditArticle } from '~/interfaces/IArticle';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/EditArticle/helper';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import useArticlesStore from '~/store/entities/articles';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { getById } from '~/store/entities/selectors';

export interface IUseEditArticle {
  articleId: string;
}

const useEditArticle = ({ articleId }: IUseEditArticle) => {
  // todo merge post & article store later
  const articleFromStore = useArticlesStore(getById(articleId));
  const articleFromPostStore = usePostsStore(postsSelector.getPost(articleId));
  const article = articleFromStore || articleFromPostStore || {};

  const actions = useEditArticleStore((state) => state.actions);

  const data = useEditArticleStore((state) => state.data) || {};
  const loading = useEditArticleStore((state) => state.loading);

  const groupIds = useMemo(() => data.audience?.groupIds?.join?.(','), [data.audience]);

  const isHasChange = () => {
    const isContentUpdated = article.content !== data.content;
    const isTitleUpdated = article.title !== data.title;
    const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience);
    return isTitleUpdated || isContentUpdated || isAudienceUpdated;
  };

  const initEditStoreData = () => {
    const {
      title, content, audience: audienceObject, mentions,
    } = article;
    const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
    const data: IEditArticleData = {
      title, content, audience: audienceIds, mentions,
    };
    actions.setData(data);
  };

  useEffect(() => {
    initEditStoreData();
  }, [article]);

  const enableButtonSave = isHasChange();

  const handleContentChange = (newContent: string) => {
    actions.setContent(newContent);
  };

  const handleTitleChange = (newTitle: string) => {
    actions.setTitle(newTitle);
  };

  const handleSave = () => {
    actions.putEditArticle({ articleId, data } as IParamPutEditArticle);
  };

  return {
    loading,
    enableButtonSave,
    title: data.title,
    content: data.content,
    groupIds,
    handleTitleChange,
    handleContentChange,
    handleSave,
  };
};

export default useEditArticle;
