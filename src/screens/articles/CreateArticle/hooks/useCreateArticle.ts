import { isEmpty, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Keyboard } from 'react-native';

import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import {
  IEditAritcleError, IEditArticleAudience, IEditArticleData, IEditArticleSeries, IPayloadPutEditArticle,
} from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/CreateArticle/helper';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { getMentionsFromContent } from '~/helpers/post';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import useArticlesStore from '../../ArticleDetail/store';
import { useBaseHook } from '~/hooks';

import { rootNavigationRef } from '~/router/refs';
import Button from '~/baseComponents/Button';
import { EditArticleErrorType, EMPTY_ARTICLE_CONTENT } from '~/constants/article';

const navigation = withNavigation(rootNavigationRef);

export interface IUseEditArticle {
  articleId: string;
  needToPublish?: boolean;
  handleSaveAudienceError?: (listIdAudiences: string[]) => void;
}

const useCreateArticle = ({ articleId, needToPublish, handleSaveAudienceError }: IUseEditArticle) => {
  const article = usePostsStore(postsSelector.getPost(articleId, {}));

  const articleActions = useArticlesStore((state) => state.actions);
  const actions = useCreateArticleStore((state) => state.actions);

  const data = useCreateArticleStore((state) => state.data) || {};
  const loading = useCreateArticleStore((state) => state.loading);
  const isPublishing = useCreateArticleStore((state) => state.isPublishing);

  const tempMentions = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected,
  );

  const groupIds = useMemo(() => data.audience?.groupIds?.join?.(','), [data.audience]);

  const { t } = useBaseHook();

  const isEmptyContent = () => isEmpty(data.content) || data.content === JSON.stringify(EMPTY_ARTICLE_CONTENT);

  const isHasChange = () => {
    const isContentUpdated = article.content !== data.content && !isEmptyContent();
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated = article.title !== data.title && !isEmpty(data.title);
    const isCategoriesUpdated = !isEqual(article.categories, data.categories) && !isEmpty(data.categories);
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
    const isCoverMediaUpdated = (article.coverMedia?.id !== data.coverMedia?.id) && !isEmpty(data.coverMedia);
    const isSeriesUpdated = !isEqual(article?.series, data.series);
    // console.log('\x1b[35m🐣️ useEditArticle isHasChange ', JSON.stringify({
    //   isTitleUpdated,
    //   isContentUpdated,
    //   isSummaryUpdated,
    //   isCategoriesUpdated,
    //   isAudienceUpdated,
    //   isCoverMediaUpdated,
    // }, null, 2), '\x1b[0m');
    return !isEmptyContent() // empty content lead to bug on edit content webview, always keep content not empty
      && (isTitleUpdated
      || isContentUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      // || isAudienceUpdated
      || isCoverMediaUpdated
      || isSeriesUpdated);
  };

  const getValidButtonNext = () => {
    const isTitleValid = !isEmpty(data.title);
    const isContentValid = !isEmptyContent();
    const isCategoriesValid = !isEmpty(data.categories);
    const isCoverValid = !isEmpty(data.coverMedia);
    // isAudienceValid self check at src/screens/articles/EditArticle/EditAudience/index.tsx

    return {
      isTitleValid,
      isContentValid,
      isCategoriesValid,
      isCoverValid,
    };
  };

  const initEditStoreData = () => {
    const {
      id, title, content, audience: audienceObject, mentions, summary, categories, coverMedia, series,
    } = article;
    const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(audienceObject);
    const data: IEditArticleData = {
      id, title, content: content || '', audience: audienceIds, mentions, summary, categories, coverMedia, series,
    };
    actions.setData(data);
    actions.setIsPublishing(needToPublish);
  };

  useEffect(() => {
    if (!article) articleActions.getArticleDetail(articleId);
  }, []);

  useEffect(() => {
    // for editing draft article, dont init data again
    if (article && !isPublishing) {
      initEditStoreData();
    }
  }, [article]);

  const enableButtonSave = isHasChange();
  const validButtonNext = getValidButtonNext();

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

  const handleAudiencesChange = (newAudiences: IEditArticleAudience) => {
    actions.setAudience(newAudiences);
  };

  const prepareNewSeriesData = (seriesDenied: string[]) => {
    const newSeries = [];
    data.series.forEach((series: IEditArticleSeries) => {
      const isDenied = seriesDenied.findIndex((id) => series?.id === id) > -1;
      if (!isDenied) newSeries.push(series);
    });
    return { ...data, series: newSeries };
  };

  const handleSaveError = ({ type, ids }: IEditAritcleError) => {
    if (type === EditArticleErrorType.SERIES_DENIED) {
      const listSeriesName = [];
      ids.forEach((id) => {
        const seriesData = data.series.find(
          (series: IEditArticleSeries) => series?.id === id,
        );
        listSeriesName.push(seriesData.title);
      });
      const text = listSeriesName.join(', ');

      const content = !!handleSaveAudienceError
      // eslint-disable-next-line no-template-curly-in-string
        ? t('article:remove_audiences_contains_series_content').replace('${series}', text)
      // eslint-disable-next-line no-template-curly-in-string
        : t('article:remove_series_content').replace('${series}', text);

      Store.store.dispatch(modalActions.showAlert({
        title: !!handleSaveAudienceError ? t('article:remove_audiences_contains_series_title') : t('article:remove_series_title'),
        content,
        cancelBtn: true,
        confirmLabel: t('communities:permission:btn_continue'),
        ConfirmBtnComponent: Button.Danger,
        onConfirm: () => actions.putEditArticle(
          { articleId, data: prepareNewSeriesData(ids) } as IPayloadPutEditArticle,
          (data: IEditAritcleError) => handleSaveError(data),
        ),
        confirmBtnProps: { type: 'ghost' },
      }));
    } else {
      handleSaveAudienceError?.(ids);
    }
  };

  const handleSave = () => {
    updateMentions();
    actions.putEditArticle(
      { articleId, data } as IPayloadPutEditArticle,
      (data: IEditAritcleError) => handleSaveError(data),
    );
  };

  const handleBack = (showAlert = false) => {
    // console.log('handleBack', showAlert);
    if (enableButtonSave || showAlert) {
      Keyboard.dismiss();
      Store.store.dispatch(modalActions.showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => navigation.goBack(),
      }));
      return;
    }
    navigation.goBack();
  };

  return {
    loading,
    enableButtonSave,
    validButtonNext,
    title: data.title,
    content: data.content,
    groupIds,
    handleTitleChange,
    handleContentChange,
    handleSave,
    handleBack,
    handleAudiencesChange,
  };
};

export default useCreateArticle;
