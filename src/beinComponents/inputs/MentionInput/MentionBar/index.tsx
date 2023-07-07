import React, { FC, useEffect, useRef } from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import { IMentionUser } from '~/interfaces/IPost';
import Tag from '~/baseComponents/Tag';
import images from '~/resources/images';
import { spacing } from '~/theme';
import useMentionInputStore from '../store';
import IMentionInputState, { ICursorPositionChange } from '../store/Interface';
import VerifiedView from '~/components/VerifiedView';

interface MentionBarProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  groupIds?: string,
  onVisible?: (isVisible: boolean) => void;
  onCompleteMention?: (user: IMentionUser) => void;
}

const MentionBar: FC<MentionBarProps> = ({
  style,
  groupIds: groupIdsParam,
  onVisible,
  onCompleteMention,
}: MentionBarProps) => {
  const listRef = useRef<any>();
  const text = useRef('');
  const cursorPosition = useRef(0);
  const groupIds = useRef(groupIdsParam);

  const key = useMentionInputStore((state: IMentionInputState) => state.key);
  const data = useMentionInputStore((state: IMentionInputState) => state.data);
  const canLoadMore = useMentionInputStore((state: IMentionInputState) => state.canLoadMore);
  const doRunSearch = useMentionInputStore((state: IMentionInputState) => state.doRunSearch);
  const doCompleteMention = useMentionInputStore((state: IMentionInputState) => state.doCompleteMention);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const visible = !!data?.length;

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'autocomplete-on-selection-change',
        onCursorPositionChange,
      );
      return () => {
        listener?.remove?.();
      };
    }, [],
  );

  useEffect(
    () => {
      if (key !== null && data?.length > 0) {
        listRef?.current?.scrollToOffset?.({ offset: 0, animated: true });
      }
    }, [key],
  );

  useEffect(
    () => {
      onVisible?.(visible);
    }, [visible],
  );

  const onCursorPositionChange = debounce(
    ({ position, value, groupIds: eventGroupIds }: ICursorPositionChange) => {
      text.current = value;
      cursorPosition.current = position;
      groupIds.current = eventGroupIds;
      const textBeforeCursor = value.substring(0, position);
      doRunSearch(eventGroupIds, textBeforeCursor);
    },
    100,
  );

  const onPressItem = (item: IMentionUser) => {
    onCompleteMention?.(item);
    doCompleteMention({
      item,
      text: text.current,
      cursorPosition: cursorPosition.current,
    });
  };

  const renderItem = ({ item }: any) => (
    <Tag
      testID="mention_bar.item"
      type="primary"
      size="medium"
      label={item?.fullname}
      avatar={item?.avatar || images.img_user_avatar_default}
      RightComponent={<VerifiedView size={12} isVerified={Boolean(item?.isVerified)} />}
      onActionPress={() => { onPressItem(item); }}
    />
  );

  const onLoadMore = () => {
    if (canLoadMore) {
      const textBeforeCursor = text.current.substring(0, cursorPosition.current);
      doRunSearch(groupIds.current, textBeforeCursor);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View testID="mention_bar" style={[styles.container, style]}>
      <FlatList
        ref={listRef}
        testID="mention_bar.list"
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        keyExtractor={(item) => `list-mention-bar-${item.username}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderColor: colors.gray40,
      backgroundColor: colors.white,
      alignItem: 'center',
      paddingVertical: spacing.padding.small,
    },
  });
};

export default MentionBar;
