import Clipboard from '@react-native-clipboard/clipboard';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  DeviceEventEmitter,
  FlatList, Modal, ScrollView, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle, useSharedValue, withSpring, ZoomInEasyUp, ZoomOutEasyDown,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/baseComponents';
import Checkbox from '~/baseComponents/Checkbox';
import Markdown from '~/beinComponents/Markdown';
import MarkdownView from '~/beinComponents/MarkdownView';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { getUserFromSharedPreferences } from '~/services/sharePreferences';
import { dimension } from '~/theme';
import getEnv from '~/utils/env';
import { ILogger, LogType } from './Interface';
import useModalStore from '~/store/modal';

export const EVENT_LOGGER_TAG = 'debug-logger-on-new-log';
const MAX_LOGS = 200;

const LoggerView = () => {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  const [logs, setLogs] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [settings, setSettings] = useState([LogType.API, 'auto-scroll']);
  const [authSession, setAuthSessions] = useState(null);
  const listRef = useRef<FlatList>();
  const offset = useRef(0);
  const isEndReached = useRef(true);

  const defaultX = dimension.deviceWidth / 2 - 32;
  const defaultY = dimension.deviceHeight / 2;
  const translateX = useSharedValue(defaultX);
  const translateY = useSharedValue(defaultY);
  const { showToast } = useModalStore((state) => state.actions);

  const host = getEnv('BEIN_API');
  const env = {
    SELF_DOMAIN: getEnv('SELF_DOMAIN'),
    BEIN_CHAT_DEEPLINK: getEnv('BEIN_CHAT_DEEPLINK'),
    APP_GROUP_PACKAGE_NAME_IOS: getEnv('APP_GROUP_PACKAGE_NAME_IOS'),
    APP_GROUP_PACKAGE_NAME_ANDROID: getEnv('APP_GROUP_PACKAGE_NAME_ANDROID'),
  };

  const checkAuthSessions = async () => {
    const user = await getUserFromSharedPreferences();
    if (user) {
      setAuthSessions({
        username: user.username,
        name: user.name,
        email: user.email,
        activeSessions: user.activeSessions,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuthSessions();
    })();
  }, []);

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        EVENT_LOGGER_TAG,
        onNewLog,
      );
      return () => {
        listener?.remove?.();
      };
    }, [logs, settings],
  );

  useEffect(() => {
    if (!settings.includes(LogType.API)) {
      setLogs(logs.filter((log) => log.type !== LogType.API));
    }
    if (!settings.includes(LogType.ZUSTAND)) {
      setLogs(logs.filter((log) => log.type !== LogType.ZUSTAND));
    }
  }, [settings]);

  const onNewLog = (log: ILogger) => {
    if (!settings.includes(log.type)) return;

    const newLogs = [...logs];
    if (newLogs.length >= MAX_LOGS) {
      newLogs.shift();
    }
    newLogs.push({ ...log, createdAt: new Date().toLocaleTimeString() });

    setLogs(newLogs);
  };

  const reset = () => setLogs([]);

  const copy = (copyContent: any) => {
    Clipboard.setString(JSON.stringify(copyContent, null, 2));
    showToast({ content: 'common:text_copied' });
  };

  const formatJson = useCallback((value: any) => {
    const json = JSON.stringify(value, null, 2);
    return `\`\`\`json\n${json}\n\`\`\``;
  }, []);

  const renderHeader = (type: LogType, title:string) => (
    <View style={styles.header}>
      <View style={styles.tag}>
        <Text.BadgeL color="#F8F9FF">{`${type.toString()}`}</Text.BadgeL>
      </View>
      <Text.H4 style={styles.title}>
        {title}
      </Text.H4>
    </View>
  );

  const renderItemMenu = (createdAt: string, content: string, copyContent: any) => (
    <View style={styles.itemMenu}>
      <Text.BadgeL maxLength={20}>{content}</Text.BadgeL>
      <Text.BadgeL>{createdAt}</Text.BadgeL>
      <Button.Secondary
        style={styles.settingButton}
        onPress={() => copy(copyContent)}
      >
        Copy
      </Button.Secondary>
    </View>
  );

  const renderItem = ({ item }: {item: ILogger}) => {
    const { type, data, createdAt } = item;

    if (type === LogType.API) {
      const request = data.config?.params || data.config?.data;
      const response = formatJson(data);

      const statusText = data.isAxiosError
        ? `Error Code: ${data.status}`
        : `Status Code: ${data.status}`;

      const urlText = `${data.config?.method.toUpperCase()} ${data.config?.url.replace(host, '')}`;
      const copyContent = { url: data.config?.url, request, reponse: data.data };

      return (
        <View>
          {renderHeader(type, urlText)}
          {renderItemMenu(createdAt, statusText, copyContent)}
          {request && (
          <View>
            <Text.BadgeM>Request</Text.BadgeM>
            <Markdown
              value={formatJson(request)}
            />
          </View>
          )}
          <Text.BadgeM>Response</Text.BadgeM>
          <Markdown
            value={response}
          />
        </View>
      );
    }

    if (type === LogType.ZUSTAND) {
      return (
        <View>
          {renderHeader(type, data.storeName)}
          {renderItemMenu(createdAt, data.title, data.state)}
          <Text.BadgeM>State</Text.BadgeM>
          <Markdown
            value={formatJson(data.state)}
          />
        </View>
      );
    }

    const tag = item?.data?.tag || 'Anonymous';
    const value = item?.data?.value || item;
    const content = formatJson(value);

    return (
      <View>
        {renderHeader(LogType.LOG, tag)}
        {renderItemMenu(createdAt, null, content)}
        <Text.BadgeM>Content</Text.BadgeM>
        <Markdown
          value={content}
        />
      </View>
    );
  };

  const onContentSizeChange = () => {
    if (settings.includes('auto-scroll') && isEndReached) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  };

  const onScroll = useCallback((event:any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    const dif = currentOffset - (offset.current || 0);

    if (dif < 0) {
      isEndReached.current = false;
    }

    offset.current = currentOffset;
  }, []);

  const onEndReached = () => {
    isEndReached.current = true;
  };

  const open = () => setVisible(true);

  const close = () => setVisible(false);

  const openSettings = () => setSettingVisible(true);

  const closeSettings = () => setSettingVisible(false);

  const onSettingChange = useCallback((type: string, isChecked: boolean) => {
    if (isChecked) {
      setSettings([...settings, type]);
    } else {
      setSettings(settings.filter((setting) => setting !== type));
    }
  }, [settings]);

  const renderSettingItem = (type: string, label: string) => (
    <Checkbox
      style={styles.space16}
      label={label}
      isChecked={settings.includes(type)}
      onPress={(isChecked) => onSettingChange(type, isChecked)}
    />
  );

  const renderSettings = () => (
    <Modal transparent visible={settingVisible} animationType="slide">
      <View style={styles.settingsModal}>
        <View style={styles.settingsMenu}>
          <View style={styles.menubar}>
            <Text.BadgeL>Settings</Text.BadgeL>
            <Button.Secondary onPress={closeSettings}>
              Close
            </Button.Secondary>
          </View>
          <ScrollView>
            <View style={styles.body}>
              {renderSettingItem(LogType.API, 'API Request')}
              {renderSettingItem('auto-scroll', 'Auto scroll to top')}
            </View>
            <View style={styles.appInfo}>
              <Text.BadgeM>App ENV</Text.BadgeM>
              <MarkdownView>{formatJson(env)}</MarkdownView>
              <Text.BadgeM>Auth session</Text.BadgeM>
              <MarkdownView>{formatJson(authSession)}</MarkdownView>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderItemSeparatorComponent = () => <ViewSpacing height={16} />;

  const renderModal = () => {
    if (!visible) return null;

    return (
      <Animated.View style={styles.modal} entering={ZoomInEasyUp} exiting={ZoomOutEasyDown}>
        <View style={styles.menubar}>
          <View>
            <Button.Neutral onPress={close}>Close</Button.Neutral>
          </View>
          <View style={styles.horizontal}>
            <Button.Secondary style={styles.settingButton} onPress={openSettings}>
              Settings
            </Button.Secondary>
            <Button.Danger onPress={reset}>Clear</Button.Danger>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            ref={listRef}
            data={logs}
            inverted
            renderItem={renderItem}
            onEndReached={onEndReached}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}
            // contentContainerStyle={{
            //   flexGrow: 1,
            // }}
            ItemSeparatorComponent={renderItemSeparatorComponent}
            keyExtractor={(item, index) => `debug-logger-item-${index}`}
          />
        </View>
      </Animated.View>
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      translateX.value = withSpring(defaultX);
    },
  });

  return (
    <PanGestureHandler
      failOffsetY={[-5, 5]}
      activeOffsetX={[-5, 5]}
      onGestureEvent={gestureHandler}
    >
      <Animated.View
        style={[
          styles.container,
          visible ? styles.containerExpanded : animatedStyle]}
      >
        <TouchableOpacity onPress={open}>
          <View style={styles.icon}>
            <Text>🐞</Text>
          </View>
        </TouchableOpacity>
        {renderModal()}
        {renderSettings()}
      </Animated.View>
    </PanGestureHandler>
  );
};

const createStyles = (insets: EdgeInsets) => StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    paddingBottom: insets.bottom,
    paddingTop: insets.top,
  },
  containerExpanded: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FF',
  },
  modal: {
    // flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#F8F9FF',
    paddingTop: insets.top,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  icon: {
    borderRadius: 100,
    width: 40,
    height: 40,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menubar: {
    width: '100%',
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#D1D4DB',
    borderBottomWidth: 1,
  },
  settingButton: {
    marginEnd: 8,
  },
  text: {
    color: '#0D0F1C',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  title: {
    flexShrink: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  body: {
    padding: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginEnd: 8,
    backgroundColor: '#0D0F1C',
    color: '#D1D4DB',
  },
  itemMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    alignItems: 'center',
  },
  settingsModal: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 21, 26, 0.6)',
  },
  settingsMenu: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: insets.top,
    marginBottom: insets.bottom,
  },
  horizontal: {
    flexDirection: 'row',
  },
  space16: {
    marginBottom: 16,
  },
  appInfo: {
    paddingHorizontal: 16,
  },
});

export default LoggerView;
