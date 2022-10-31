import { isEmpty, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Keyboard } from 'react-native';
import i18next from 'i18next';

import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import { IEditArticleAudience, IEditArticleData, IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/EditArticle/helper';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import { getMentionsFromContent } from '~/screens/post/helper/postUtils';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import useArticlesStore from '../../ArticleDetail/store';

import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

export interface IUseEditArticle {
  articleId: string;
}

const useEditArticle = ({ articleId }: IUseEditArticle) => {
  const article = usePostsStore(postsSelector.getPost(articleId));

  const articleActions = useArticlesStore((state) => state.actions);
  const actions = useEditArticleStore((state) => state.actions);

  const data = useEditArticleStore((state) => state.data) || {};
  const loading = useEditArticleStore((state) => state.loading);

  const tempMentions = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected,
  );

  const groupIds = useMemo(() => data.audience?.groupIds?.join?.(','), [data.audience]);

  const isHasChange = () => {
    const isContentUpdated = article.content !== data.content && !isEmpty(data.content);
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated = article.title !== data.title && !isEmpty(data.title);
    const isCategoriesUpdated = !isEqual(article.categories, data.categories) && !isEmpty(data.categories);
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
    const isCoverMediaUpdated = (article.coverMedia?.id !== data.coverMedia?.id) && !isEmpty(data.coverMedia);
    // console.log('\x1b[35m🐣️ useEditArticle isHasChange ', JSON.stringify({
    //   isTitleUpdated,
    //   isContentUpdated,
    //   isSummaryUpdated,
    //   isCategoriesUpdated,
    //   isAudienceUpdated,
    //   isCoverMediaUpdated,
    // }, null, 2), '\x1b[0m');
    return !isEmpty(data.content) // empty content lead to bug on edit content webview, always keep content not empty
      && (isTitleUpdated
      || isContentUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      // || isAudienceUpdated
      || isCoverMediaUpdated);
  };

  const initEditStoreData = () => {
    const {
      title, content, audience: audienceObject, mentions, summary, categories, coverMedia,
    } = article;
    const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
    const data: IEditArticleData = {
      title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia,
    };
    actions.setData(data);
  };

  useEffect(() => {
    if (!article) articleActions.getArticleDetail(articleId);
  }, []);

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

  const updateMentions = () => {
    const newMentions = getMentionsFromContent(data.content, tempMentions);
    actions.setMentions(newMentions);
  };

  const handleSave = () => {
    updateMentions();
    actions.putEditArticle({ articleId, data } as IPayloadPutEditArticle);
  };

  const handleBack = () => {
    if (enableButtonSave) {
      Keyboard.dismiss();
      Store.store.dispatch(modalActions.showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => navigation.goBack(),
      }));
      return;
    }
    navigation.goBack();
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
    handleBack,
  };
};

export default useEditArticle;
