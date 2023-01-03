import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useImperativeHandle, useRef,
} from 'react';
import {
  Platform, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import WebView from 'react-native-webview';
import { CUSTOM_META, getInjectableJSMessage, USER_AGENT_DESKTOP } from '~/utils/link';
import { parseSafe } from '~/utils/common';
import useMounted from '~/hooks/mounted';
import getEnv from '~/utils/env';

export enum EventType {
    ON_LOAD_END = 'onLoadEnd', // must post content to editor after editor is mounted
    ON_INITIALIZE_END='onInitializeEnd', // after editor initiated content
    ON_SCROLL = 'onScroll'
}

const ARTICLE_EDITOR_URL = `https://${getEnv('SELF_DOMAIN')}/article/webview/v1`;
// const ARTICLE_EDITOR_URL = 'http://10.1.1.170:8088/article/webview';

export interface ArticleWebviewRef {
  injectJavaScript: (script: any) => void,
}

export interface ArticleWebviewProps {
  style?: StyleProp<ViewStyle>;
  webViewRef?: React.Ref<ArticleWebviewRef>;
  initScript: {type: string, payload: any};

  onScroll?: (event: {offsetY: number}) => void;
  onMessage: (message: {type: string, payload: any}) => void;
  onInitializeEnd?: () => void;
}

const ArticleWebview: FC<ArticleWebviewProps> = ({
  style,
  webViewRef,
  initScript,

  onScroll,
  onMessage,
  onInitializeEnd,
}: ArticleWebviewProps) => {
  const isMounted = useMounted();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const _webViewRef = useRef<WebView>();

  // mention on android only work on desktop browser
  const userAgent = Platform.OS === 'android' ? USER_AGENT_DESKTOP : undefined;

  const injectJavaScript = (script: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _webViewRef?.current?.injectJavaScript?.(getInjectableJSMessage(script));
  };

  const blur = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _webViewRef?.current?.injectJavaScript?.('document.activeElement.blur()');
  };

  useImperativeHandle(
    webViewRef, () => ({
      injectJavaScript,
      blur,
    }),
  );

  const onLoadEnd = () => {
    injectJavaScript(initScript);
  };

  const _onInitializeEnd = () => {
    _webViewRef.current?.requestFocus();
    onInitializeEnd?.();
  };

  const _onMessage = (event: any) => {
    const message = parseSafe(event?.nativeEvent?.data);

    switch (message?.type) {
      case EventType.ON_LOAD_END:
        return onLoadEnd();
      case EventType.ON_INITIALIZE_END:
        return _onInitializeEnd?.();
      case EventType.ON_SCROLL:
        return onScroll?.(message?.payload);
      default:
        return onMessage(message);
    }
  };

  if (!isMounted) return null;

  return (
    <View testID="article_webview" style={[styles.container, style]}>
      <WebView
        testID="webview"
        key="article-webview"
        ref={_webViewRef}
        style={styles.webview}
        source={{ uri: ARTICLE_EDITOR_URL }}
        bounces
        cacheEnabled
        // avoid nested scroll
        overScrollMode="never"
        scrollEnabled={false}
        scalesPageToFit
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        saveFormDataDisabled
        allowsFullscreenVideo
        hideKeyboardAccessoryView
        androidHardwareAccelerationDisabled
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
        onMessage={_onMessage}
      />
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
    webview: {
      flex: 1,
      width: '100%',
      height: '100%',
      opacity: 0.99,
      overflow: 'hidden',
    },
  });
};

export default React.forwardRef((
  props: ArticleWebviewProps, ref: React.MutableRefObject<ArticleWebviewRef>,
) => (
  <ArticleWebview webViewRef={ref} {...props} />
));
