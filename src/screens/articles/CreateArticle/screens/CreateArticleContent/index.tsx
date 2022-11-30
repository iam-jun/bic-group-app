import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import { createTextStyle } from '~/baseComponents/Text/textStyle';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import ArticleWebview, { ArticleWebviewRef } from '~/components/articles/ArticleWebview';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import spacing from '~/theme/spacing';
import useCreateArticleStore from '../../store';
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

const EMPTY_CONTENT = [{ type: 'p', children: [{ text: '' }] }];

const CreateArticleContent: FC<CreateArticleContentProps> = ({ route }: CreateArticleContentProps) => {
  const articleId = route?.params?.articleId;

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const ref = useRef<ArticleWebviewRef>();

  const articleData = useCreateArticle({ articleId });
  const {
    loading, enableButtonSave, validButtonNext, content, groupIds,
    handleSave, handleBack, handleContentChange,
  } = articleData || {};
  const isPublishing = useCreateArticleStore((state) => state.isPublishing);
  const runSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const setFullContent = useMentionInputStore((state: IMentionInputState) => state.setFullContent);

  const initScript = {
    type: 'initEdit',
    payload: {
      contentState: parseSafe(content) || EMPTY_CONTENT,
    },
  };

  const disabled = (isPublishing ? !validButtonNext.isContentValid : !enableButtonSave) || loading;

  const onPressSave = () => {
    handleSave();
  };

  const goBack = () => {
    rootNavigation.goBack();
  };

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

  const onChangeContent = debounce((value) => {
    handleContentChange(value);
  }, 500);

  const onChangeText = (payload: any) => {
    setFullContent(payload?.rawContent);
    onChangeContent?.(JSON.stringify(payload?.contentState));
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
      webViewRef?.current?.injectJavaScript?.('document.activeElement.blur()');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_content')}
        buttonProps={{ disabled, loading, style: styles.btnPublish }}
        buttonText={t(isPublishing ? 'common:btn_publish' : 'common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={isPublishing ? goBack : handleBack}
      />
      <View style={styles.flex1}>
        <ArticleWebview
          ref={ref}
          initScript={initScript}
          onMessage={onMessage}
        />
        <View style={styles.toolbarContainer}>
          <MentionBar
            groupIds={groupIds}
            style={styles.mentionBar}
            onCompleteMention={onCompleteMention}
          />
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
          <KeyboardSpacer iosOnly />
          <InsetBottomView />
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const textStyle = createTextStyle(theme);

  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    inputTitle: {
      ...textStyle.bodyMMedium,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderColor: colors.gray5,
      maxHeight: 80,
    },
    btnPublish: {
      marginRight: spacing.margin.small,
    },
    toolbarContainer: {
      width: '100%',
      position: 'absolute',
      zIndex: 3,
      bottom: 0,
      backgroundColor: colors.white,
    },
    mentionBar: {
      height: 50,
    },
  });
};

export default CreateArticleContent;
