import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import ArticleWebview, { ArticleWebviewRef } from '~/components/articles/ArticleWebview';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import spacing from '~/theme/spacing';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import ArticleFormatToolBar from '~/components/articles/ArticleFormatToolBar';
import {
  AlignType, HeadingType, ListType, MarkType,
} from '~/components/articles/ArticleFormatToolBar/constant';
import { parseSafe } from '~/utils/common';
import { IMentionUser } from '~/interfaces/IPost';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import InsetBottomView from '~/baseComponents/InsetBottomView';
import { EMPTY_ARTICLE_CONTENT } from '~/constants/article';
import postsSelector from '~/store/entities/posts/selectors';
import usePostsStore from '~/store/entities/posts';
import ToastAutoSave from '~/screens/post/CreatePost/components/ToastAutoSave';
import { useBackPressListener } from '~/hooks/navigation';
import { isEmptyContent } from '../../helper';
import useCreateArticleStore from '../../store';

export enum EventType {
    ON_EDITOR_CHANGE = 'onEditorChange',
    ON_SEARCH_MENTION = 'onSearchMention',
    ON_PRESS_MENTION = 'onPressMention'
}

export interface CreateArticleContentProps {
  route?: {
    params?: {articleId: string};
  };
}

const CreateArticleContent: FC<CreateArticleContentProps> = ({ route }: CreateArticleContentProps) => {
  const articleId = route?.params?.articleId;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const ref = useRef<ArticleWebviewRef>();

  const article = usePostsStore(useCallback(postsSelector.getPost(articleId, {}), [articleId]));
  const { content: articleContent } = article;

  const articleData = useCreateArticle({ articleId });
  const {
    loading, content, groupIds,
    handleSave, handleBack, handleContentChange, isShowToastAutoSave,
  } = articleData || {};

  const isDraft = useCreateArticleStore((state) => state.isDraft);

  const runSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const resetMention = useMentionInputStore((state: IMentionInputState) => state.reset);

  const setFullContent = useMentionInputStore((state: IMentionInputState) => state.setFullContent);

  const [initializeEnd, setInitializeEnd] = useState(false);

  const initScript = {
    type: 'initEdit',
    payload: {
      contentState: parseSafe(content) || EMPTY_ARTICLE_CONTENT,
    },
  };

  // this variable is used for edit article
  // draft article is auto save, so no need to use this variable
  const isChanged = articleContent !== content;
  const isContentUpdated = !isDraft && isChanged && !isEmptyContent(content);
  const disabledSaveForEditArticle = !isContentUpdated || loading;
  const disabledSaveForEditDraftArticle = isEmptyContent(content) || loading;
  const disabled = isDraft ? disabledSaveForEditDraftArticle : disabledSaveForEditArticle;

  useEffect(() => () => {
    resetMention();
  }, []);

  const onPressSave = () => {
    handleSave();
  };

  const onBack = () => {
    handleBack(isChanged);
  };

  useBackPressListener(onBack);

  const onInitializeEnd = () => setInitializeEnd(true);

  const injectJavaScript = (script: any) => {
    ref?.current?.injectJavaScript?.(script);
  };

  const onCompleteMention = (user: IMentionUser) => {
    injectJavaScript({
      type: 'insertMention',
      payload: {
        key: user.id,
        text: user.username,
        data: user,
      },
    });
  };

  const insertVideoEmbed = (url: string) => {
    injectJavaScript({
      type: 'insertVideoEmbed',
      payload: url,
    });
  };

  const insertLink = (url: string, text: string) => {
    injectJavaScript({
      type: 'insertLink',
      payload: { url, text },
    });
  };

  const insertImage = (url) => {
    injectJavaScript({
      type: 'insertNodes',
      payload: {
        type: 'img',
        children: [{ text: 'img' }],
        url,
      },
    });
  };

  const toggleQuote = () => {
    injectJavaScript({ type: 'toggleQuote' });
  };

  const toggleMark = (type: MarkType) => {
    injectJavaScript({ type: 'toggleMark', payload: type });
  };

  const setAlign = (type: AlignType) => {
    injectJavaScript({ type: 'setAlign', payload: type });
  };

  const toggleList = (type: ListType) => {
    injectJavaScript({ type: 'toggleList', payload: type });
  };

  const toggleHeading = (type: HeadingType) => {
    injectJavaScript({ type: 'toggleHeading', payload: type });
  };

  const onChangeContent = (value) => {
    handleContentChange(value);
  };

  const onChangeText = (payload: any) => {
    const { rawContent, contentState } = payload || {};

    setFullContent(rawContent);
    onChangeContent?.(JSON.stringify(contentState));
  };

  const onMention = (payload: any) => {
    if (payload?.searchText) {
      runSearch(groupIds, payload?.searchText, true);
    }
  };

  const onMessage = (message: any) => {
    const payload = message?.payload;

    switch (message?.type) {
      case EventType.ON_EDITOR_CHANGE:
        return onChangeText(payload);
      case EventType.ON_SEARCH_MENTION:
        return onMention(payload);
      default:
        return console.warn('Article webview onMessage unhandled', message);
    }
  };

  /**
   * if webview has activeElement, keyboard can not dissmiss
   * it affects to stickerview
   * */
  const onModalVisbleChanged = (visible: boolean) => {
    if (visible) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref?.current?.injectJavaScript?.('document.activeElement.blur()');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_content')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <View style={styles.contentContainer}>
        <ArticleWebview
          ref={ref}
          initScript={initScript}
          onMessage={onMessage}
          onInitializeEnd={onInitializeEnd}
        />
        <View style={styles.toolbarContainer}>
          <ToastAutoSave visible={isShowToastAutoSave} />
          <MentionBar
            groupIds={groupIds}
            onCompleteMention={onCompleteMention}
          />
          {initializeEnd && (
            <ArticleFormatToolBar
              setAlign={setAlign}
              toggleList={toggleList}
              toggleMark={toggleMark}
              insertLink={insertLink}
              toggleQuote={toggleQuote}
              insertImage={insertImage}
              toggleHeading={toggleHeading}
              insertVideoEmbed={insertVideoEmbed}
              onModalVisbleChanged={onModalVisbleChanged}
            />
          )}
          <InsetBottomView />
          <KeyboardSpacer iosOnly />
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    toolbarContainer: {
      width: '100%',
      backgroundColor: colors.white,
    },
  });
};

export default CreateArticleContent;
