import {
  DeviceEventEmitter,
  FlatList, Modal, StyleSheet, View,
} from 'react-native';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { ZoomInEasyUp, ZoomOutEasyDown } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';
import { Button } from '~/baseComponents';
import Markdown from '~/beinComponents/Markdown';
import Text from '~/beinComponents/Text';
import modalActions from '~/storeRedux/modal/actions';
import getEnv from '~/utils/env';
import { ILogger, LogType } from './Interface';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Checkbox from '~/baseComponents/Checkbox';

export const EVENT_LOGGER_TAG = 'debug-logger-on-new-log';
const MAX_LOGS = 200;

const LogView = () => {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);
  const [logs, setLogs] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [settings, setSettings] = useState(['api', 'auto-scroll']);
  const dispatch = useDispatch();
  const listRef = useRef<FlatList>();
  const offset = useRef(0);
  const isEndReached = useRef(true);

  const host = getEnv('BEIN_API');

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        EVENT_LOGGER_TAG,
        onNewLog,
      );
      return () => {
        listener?.remove?.();
      };
    }, [logs],
  );

  const onNewLog = (log: ILogger) => {
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
    dispatch(modalActions.showHideToastMessage({ content: 'Copied' }));
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
      <Text.BadgeL>{content}</Text.BadgeL>
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

  const onSettingChange = (type: string, isChecked: boolean) => {
    if (isChecked) {
      setSettings([...settings, type]);
    } else {
      setSettings(settings.filter((setting) => setting !== type));
    }
  };

  const renderSettingItem = (type:string, label:string) => (
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
          </View>
          <View style={styles.body}>
            {renderSettingItem('api', 'API Request')}
            {renderSettingItem('zustand', 'Zustand')}
            {renderSettingItem('auto-scroll', 'Auto scroll to top')}
            <Button.Secondary onPress={closeSettings}>
              Close & Save
            </Button.Secondary>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        <View style={styles.body}>
          <FlatList
            ref={listRef}
            data={logs}
            inverted
            renderItem={renderItem}
            onEndReached={onEndReached}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ItemSeparatorComponent={() => <ViewSpacing height={16} />}
            keyExtractor={(item, index) => `debug-logger-item-${index}`}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <Portal>
      <View style={[styles.container, visible && styles.containerExpanded]}>
        <TouchableOpacity onPress={open}>
          <View style={styles.icon}>
            <Text>🐞</Text>
          </View>
        </TouchableOpacity>
        {renderModal()}
        {renderSettings()}
      </View>
    </Portal>
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
  },
  modal: {
    // flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#F8F9FF',
    paddingBottom: insets.bottom,
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
  body: {
    // flex: 1,
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
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  horizontal: {
    flexDirection: 'row',
  },
  space16: {
    marginBottom: 16,
  },
});

export default LogView;
