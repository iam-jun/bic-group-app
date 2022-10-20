import { GiphyMedia } from '@giphy/react-native-sdk';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  PixelRatio,
  Platform, ScrollView, StyleSheet, View,
} from 'react-native';
import { debounce } from 'lodash';
import WebView from 'react-native-webview';
import { CUSTOM_META, getInjectableJSMessage, USER_AGENT_DESKTOP } from '~/utils/link';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import StickerView from '~/components/StickerView';
import { IMentionUser } from '~/interfaces/IPost';
import { parseSafe } from '~/utils/common';
import getEnv from '~/utils/env';
import useMounted from '~/hooks/mounted';

enum EventType {
    ON_LOAD_END = 'onLoadEnd',
    ON_EDITOR_CHANGE = 'onEditorChange',
    ON_SEARCH_MENTION = 'onSearchMention',
    ON_PRESS_BUTTON = 'onPressButton',
    ON_PRESS_MENTION = 'onPressMention'
}

const ARTICLE_EDITOR_URL = `https://${getEnv('SELF_DOMAIN')}/article/webview`;

export interface ArticleWebviewProps {
  articleData: any;
  readOnly?: boolean;

  onPressMentionAudience?: (user: IMentionUser) => void;
}

const ArticleWebview: FC<ArticleWebviewProps> = ({
  readOnly,
  articleData,

  onPressMentionAudience,
}: ArticleWebviewProps) => {
  const isMounted = useMounted();
  const theme: ExtendedTheme = useTheme();
  // const insets = useSafeAreaInsets();
  const styles = createStyle(theme);
  const webViewRef = useRef();
  const [isLoaded, setLoaded] = useState(false);
  const [webviewHeight, setWebviewHeight] = useState(0);
  const initHeight = 600;
  const runSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const setFullContent = useMentionInputStore((state: IMentionInputState) => state.setFullContent);

  const {
    content, groupIds, mentions, handleContentChange,
  } = articleData;

  const stickerViewRef = useRef<any>();

  const initScript = {
    type: 'initialize',
    payload: {
      readOnly,
      mentions,
      //   content: sampleData,
      content: parseSafe(content) || [],
    },
  };

  useEffect(() => {
    if (isLoaded) {
      injectJavaScript(initScript);
    }
  }, [isLoaded]);

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

  const openGif = () => {
    stickerViewRef?.current?.show?.('giphy');
  };

  const onGifSelected = (gif: GiphyMedia) => {
    stickerViewRef?.current?.hide?.();

    injectJavaScript({
      type: 'insertNodes',
      payload: {
        type: 'img',
        children: [{ text: 'img' }],
        url: gif.url,
      },
    });
  };

  const onChangeContent = debounce((value) => {
    handleContentChange(value);
  }, 500);

  const onLoadEnd = (payload: any) => {
    setLoaded(true);
    const height = Number(payload?.scrollHeight || initHeight) / PixelRatio.get();
    setWebviewHeight(height);
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

  const onPressButton = (type: string) => {
    if (type === 'gif') openGif();
  };

  const onMessage = (event: any) => {
    const message = parseSafe(event?.nativeEvent?.data);
    const payload = message?.payload;

    switch (message?.type) {
      case EventType.ON_LOAD_END:
        return onLoadEnd(payload);
      case EventType.ON_EDITOR_CHANGE:
        return onChangeText(payload);
      case EventType.ON_SEARCH_MENTION:
        return onMention(payload);
      case EventType.ON_PRESS_BUTTON:
        return onPressButton(payload);
      case EventType.ON_PRESS_MENTION:
        return onPressMentionAudience?.(payload);
      default:
        return console.warn('Article webview onMessage unhandled', message);
    }
  };

  // mention on android only work on desktop browser
  const userAgent = Platform.OS === 'android' ? USER_AGENT_DESKTOP : undefined;

  if (!isMounted) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        { !isLoaded && <LoadingIndicator />}
        <WebView
          ref={webViewRef}
          style={[styles.webview, readOnly && { height: webviewHeight }]}
          source={{ uri: ARTICLE_EDITOR_URL }}
          // source={{ uri: 'https://f1f5-222-253-125-178.ap.ngrok.io/article/webview' }}
          // useWebKit
          cacheEnabled
          scalesPageToFit
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          saveFormDataDisabled
          hideKeyboardAccessoryView
          scrollEnabled={false}
          nestedScrollEnabled={false}
          userAgent={userAgent}
          androidLayerType="hardware"
          injectedJavaScript={CUSTOM_META}
          showsHorizontalScrollIndicator={false}
          mediaPlaybackRequiresUserAction={false}
          automaticallyAdjustContentInsets={false}
          onMessage={onMessage}
        />
      </ScrollView>
      <View style={styles.mentions}>
        <MentionBar groupIds={groupIds} style={styles.mentionBar} onCompleteMention={onCompleteMention} />
        <StickerView
          stickerViewRef={stickerViewRef}
          onGifSelected={onGifSelected}
        />
        <KeyboardSpacer />
      </View>
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
    },
    mentions: {
      width: '100%',
      position: 'absolute',
      zIndex: 3,
      bottom: 0,
    },
    mentionBar: {
      height: 60,
    },
  });
};

export default ArticleWebview;
