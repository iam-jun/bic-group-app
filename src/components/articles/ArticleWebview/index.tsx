import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  Platform, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { debounce } from 'lodash';
import WebView from 'react-native-webview';
import { CUSTOM_META, getInjectableJSMessage, USER_AGENT_DESKTOP } from '~/utils/link';
import { IMentionUser } from '~/interfaces/IPost';
import { parseSafe } from '~/utils/common';
import { padding } from '~/theme/spacing';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import useMounted from '~/hooks/mounted';
import getEnv from '~/utils/env';
import ArticleFormatToolBar from '../ArticleFormatToolBar';
import {
  AlignType, HeadingType, ListType, MarkType,
} from '../ArticleFormatToolBar/constant';
import InsetBottomView from '~/baseComponents/InsetBottomView';

enum EventType {
    ON_LOAD_END = 'onLoadEnd', // must post content to editor after editor is mounted
    ON_INITIALIZE_END='onInitializeEnd', // after editor initiated content return scrollHeight
    ON_EDITOR_CHANGE = 'onEditorChange',
    ON_SEARCH_MENTION = 'onSearchMention',
    ON_PRESS_MENTION = 'onPressMention'
}

const ARTICLE_EDITOR_URL = `https://${getEnv('SELF_DOMAIN')}/article/webview`;
// const ARTICLE_EDITOR_URL = 'http://10.1.1.178:8088/article/webview';
const EMPTY_CONTENT = [{ type: 'p', children: [{ text: '' }] }];

export interface ArticleWebviewProps {
  style?: StyleProp<ViewStyle>;
  articleData: any;
  readOnly?: boolean;
  isLoaded?: boolean;

  onInitializeEnd?: () => void;
  onPressMentionAudience?: (user: IMentionUser) => void;
}

const ArticleWebview: FC<ArticleWebviewProps> = ({
  style,
  readOnly,
  isLoaded,
  articleData,

  onInitializeEnd,
  onPressMentionAudience,
}: ArticleWebviewProps) => {
  const isMounted = useMounted();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  // mention on android only work on desktop browser
  const userAgent = Platform.OS === 'android' ? USER_AGENT_DESKTOP : undefined;

  const webViewRef = useRef();
  const fakeWebViewRef = useRef();
  const [webviewHeight, setWebviewHeight] = useState(0);
  const runSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const setFullContent = useMentionInputStore((state: IMentionInputState) => state.setFullContent);

  const {
    content, groupIds, mentions, handleContentChange,
  } = articleData;

  const initScript = {
    type: 'initialize',
    payload: {
      readOnly,
      mentions,
      content: parseSafe(content) || EMPTY_CONTENT,
    },
  };

  useEffect(() => {
    // reload webview after content change
    if (isLoaded && readOnly) {
      injectJavaScript(initScript);
    }
  }, [content]);

  const injectJavaScript = (script: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    webViewRef?.current?.injectJavaScript?.(getInjectableJSMessage(script));
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

  const onLoadEnd = () => {
    injectJavaScript(initScript);
  };

  const onChangeText = (payload: any) => {
    if (readOnly) return;
    setFullContent(payload?.rawContent);
    onChangeContent?.(JSON.stringify(payload?.contentState));
  };

  const onMention = (payload: any) => {
    if (readOnly) return;

    if (payload?.searchText) {
      runSearch(groupIds, payload?.searchText, true);
    }
  };

  const _onInitializeEnd = (payload: any) => {
    // only callback onInitializeEnd on the 1st time
    if (!isLoaded) {
      onInitializeEnd?.();
    }

    if (payload?.scrollHeight >= webviewHeight) {
      setWebviewHeight(payload?.scrollHeight);
    }
  };

  const onMessage = (event: any) => {
    const message = parseSafe(event?.nativeEvent?.data);
    const payload = message?.payload;

    switch (message?.type) {
      case EventType.ON_LOAD_END:
        return onLoadEnd();
      case EventType.ON_INITIALIZE_END:
        return _onInitializeEnd(payload);
      case EventType.ON_EDITOR_CHANGE:
        return onChangeText(payload);
      case EventType.ON_SEARCH_MENTION:
        return onMention(payload);
      case EventType.ON_PRESS_MENTION:
        return onPressMentionAudience?.(payload);
      default:
        return console.warn('Article webview onMessage unhandled', message);
    }
  };

  const onFakeMessage = (event: any) => {
    const message = parseSafe(event?.nativeEvent?.data);
    const payload = message?.payload;

    switch (message?.type) {
      case EventType.ON_LOAD_END:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fakeWebViewRef?.current?.injectJavaScript?.(getInjectableJSMessage(initScript));
        break;
      case EventType.ON_INITIALIZE_END:
        setWebviewHeight(payload?.scrollHeight);
        break;
      default:
        return null;
    }
  };

  const renderFakeWebview = () => (
    <WebView
      key="article-fake-webview"
      ref={fakeWebViewRef}
      style={styles.fakeWebview}
      source={{ uri: ARTICLE_EDITOR_URL }}
      useWebKit
      cacheEnabled
      javaScriptEnabled
      domStorageEnabled
      androidHardwareAccelerationDisabled
      animationEnabled={false}
      androidLayerType="software"
      injectedJavaScript={CUSTOM_META}
      onMessage={onFakeMessage}
    />
  );

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

  const renderWebview = () => {
    if (Platform.OS === 'android' && readOnly && webviewHeight === 0) {
      return renderFakeWebview();
    }

    return (
      <WebView
        key="article-webview"
        ref={webViewRef}
        style={[styles.webview, style, readOnly && { height: webviewHeight }]}
        containerStyle={readOnly && styles.webviewContainer}
        source={{ uri: ARTICLE_EDITOR_URL }}
        useWebKit
        cacheEnabled
        bounces={false}
        scalesPageToFit
        javaScriptEnabled
        domStorageEnabled
        saveFormDataDisabled
        allowsFullscreenVideo
        hideKeyboardAccessoryView
        keyboardDisplayRequiresUserAction
        androidHardwareAccelerationDisabled
        animationEnabled={false}
        nestedScrollEnabled={false}
        scrollEnabled={!readOnly}
        startInLoadingState={!readOnly}
        // force open native video player for the best performance
        allowsInlineMediaPlayback={false}
        userAgent={userAgent}
        /**
         * article detail may crash if androidLayerType set to hardware because of dynamic height
         * but article editor is very laggy if androidLayerType set to software
         */
        androidLayerType="hardware"
        injectedJavaScript={CUSTOM_META}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        mediaPlaybackRequiresUserAction={false}
        automaticallyAdjustContentInsets={false}
        onMessage={onMessage}
      />
    );
  };

  if (!isMounted) return null;

  return (
    <View style={styles.container}>
      {renderWebview()}
      {!readOnly && (
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
      )}
    </View>

  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
    webview: {
      width: '100%',
      height: '100%',
      opacity: 0.99,
      overflow: 'hidden',
    },
    webviewContainer: {
      paddingHorizontal: padding.large,
    },
    fakeWebview: {
      height: 0,
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

export default ArticleWebview;
