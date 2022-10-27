import { GiphyMedia } from '@giphy/react-native-sdk';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  Platform, StyleSheet, View,
} from 'react-native';
import { debounce } from 'lodash';
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { CUSTOM_META, getInjectableJSMessage, USER_AGENT_DESKTOP } from '~/utils/link';
import { IMentionUser } from '~/interfaces/IPost';
import { parseSafe } from '~/utils/common';
import { padding } from '~/theme/spacing';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import StickerView from '~/components/StickerView';
import getEnv from '~/utils/env';
import useMounted from '~/hooks/mounted';
import ImagePicker from '~/beinComponents/ImagePicker';
import { uploadImage } from '../../helper';
import { IGetFile } from '~/services/imageUploader';

enum EventType {
    ON_LOAD_END = 'onLoadEnd', // must post content to editor after editor is mounted
    ON_INITIALIZE_END='onInitializeEnd', // after editor initiated content return scrollHeight
    ON_EDITOR_CHANGE = 'onEditorChange',
    ON_SEARCH_MENTION = 'onSearchMention',
    ON_PRESS_BUTTON = 'onPressButton',
    ON_PRESS_MENTION = 'onPressMention'
}

const ARTICLE_EDITOR_URL = `https://${getEnv('SELF_DOMAIN')}/article/webview`;
// const ARTICLE_EDITOR_URL = 'http://10.1.1.253:8088/article/webview';

export interface ArticleWebviewProps {
  articleData: any;
  readOnly?: boolean;

  onInitializeEnd?: () => void;
  onPressMentionAudience?: (user: IMentionUser) => void;
}

const ArticleWebview: FC<ArticleWebviewProps> = ({
  readOnly,
  articleData,

  onInitializeEnd,
  onPressMentionAudience,
}: ArticleWebviewProps) => {
  const isMounted = useMounted();
  const theme: ExtendedTheme = useTheme();
  const dispatch = useDispatch();

  // mention on android only work on desktop browser
  const userAgent = Platform.OS === 'android' ? USER_AGENT_DESKTOP : undefined;

  // const insets = useSafeAreaInsets();
  const styles = createStyle(theme);
  const webViewRef = useRef();
  const fakeWebViewRef = useRef();
  const [webviewHeight, setWebviewHeight] = useState(0);
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
    // reload webview after content change
    if (readOnly) {
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

  const openGif = () => {
    stickerViewRef?.current?.show?.('giphy');
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

  const onGifSelected = (gif: GiphyMedia) => {
    stickerViewRef?.current?.hide?.();
    insertImage(gif.url);
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

  const openGallery = async () => {
    const image = await ImagePicker.openPickerSingle({
      mediaType: 'photo',
    });

    uploadImage({ file: image, dispatch, onSuccess: (file: IGetFile) => insertImage(file?.url) });
  };

  const onPressButton = (type: string) => {
    switch (type) {
      case 'gif':
        return openGif();
      case 'image':
        return openGallery();
    }
  };

  const _onInitializeEnd = (payload: any) => {
    setWebviewHeight(payload?.scrollHeight);
    onInitializeEnd?.();
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
      case EventType.ON_PRESS_BUTTON:
        return onPressButton(payload);
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

  const renderFakeWebview = () => {
    if (Platform.OS !== 'android' || webviewHeight > 0) return null;

    return (
      <WebView
        ref={fakeWebViewRef}
        style={styles.fakeWebview}
        source={{ uri: ARTICLE_EDITOR_URL }}
        // source={{ uri: 'http://10.1.1.253:8088/article/webview' }}
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
  };

  const renderWebview = () => {
    if (Platform.OS === 'android' && webviewHeight <= 0) return null;

    return (
      <WebView
        ref={webViewRef}
        style={[styles.webview, readOnly && { height: webviewHeight }]}
        containerStyle={styles.webViewContainer}
        source={{ uri: ARTICLE_EDITOR_URL }}
        // source={{ uri: 'http://10.1.1.253:8088/article/webview' }}
        useWebKit
        cacheEnabled
        bounces={false}
        scalesPageToFit
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        saveFormDataDisabled
        allowsFullscreenVideo
        hideKeyboardAccessoryView
        androidHardwareAccelerationDisabled
        scrollEnabled={!readOnly}
        animationEnabled={false}
        nestedScrollEnabled={false}
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
      {renderFakeWebview()}
      {!readOnly && (
        <View style={styles.mentions}>
          <MentionBar groupIds={groupIds} style={styles.mentionBar} onCompleteMention={onCompleteMention} />
          <StickerView
            stickerViewRef={stickerViewRef}
            onGifSelected={onGifSelected}
          />
          <KeyboardSpacer iosOnly />
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
    webViewContainer: {
      padding: padding.large,
    },
    webview: {
      width: '100%',
      height: '100%',
      opacity: 0.99,
      overflow: 'hidden',
    },
    fakeWebview: {
      height: 0,
    },
    mentions: {
      width: '100%',
      position: 'absolute',
      zIndex: 3,
      bottom: 0,
    },
    mentionBar: {
      height: 50,
    },
  });
};

export default ArticleWebview;
