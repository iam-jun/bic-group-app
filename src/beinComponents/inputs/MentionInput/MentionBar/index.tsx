import React, {FC, useEffect, useRef} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {useKeySelector} from '~/hooks/selector';
import {IMentionUser} from '~/interfaces/IPost';

import {
  checkRunSearch,
  completeMention,
  ICursorPositionChange,
} from '~/beinComponents/inputs/MentionInput/helper';
import MentionBarItem from '~/beinComponents/inputs/MentionInput/MentionBar/MentionBarItem';
import Divider from '~/beinComponents/Divider';
import {debounce} from 'lodash';
import spacing from '~/theme/spacing';

interface MentionBarProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  type?: string;
  onVisible?: (isVisible: boolean) => void;
}

const MentionBar: FC<MentionBarProps> = ({
  style,
  type = 'mentionInput',
  onVisible,
}: MentionBarProps) => {
  const listRef = useRef<any>();
  const text = useRef('');
  const cursorPosition = useRef(0);

  const dispatch = useDispatch();
  const {data} = useKeySelector(type);

  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const isShow = !!data?.length;

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-selection-change',
      onCursorPositionChange,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      listRef?.current?.scrollToOffset?.({offset: 0, animated: true});
    }
  }, [data?.length]);

  useEffect(() => {
    onVisible?.(isShow);
  }, [isShow]);

  const onCursorPositionChange = debounce(
    ({position, value, groupIds}: ICursorPositionChange) => {
      text.current = value;
      cursorPosition.current = position;
      checkRunSearch(value.substring(0, position), groupIds, dispatch);
    },
    100,
  );

  const onPressItem = (item: IMentionUser) => {
    completeMention({
      item,
      dispatch,
      text: text.current,
      cursorPosition: cursorPosition.current,
    });
  };

  const renderItem = ({item}: any) => {
    return (
      <MentionBarItem
        testID="mention_bar.item"
        data={item}
        onPress={onPressItem}
      />
    );
  };

  if (!isShow) {
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
        keyboardShouldPersistTaps={'handled'}
        ItemSeparatorComponent={() => (
          <Divider
            testID="mention_bar.list.divider"
            horizontal
            style={{marginVertical: spacing.margin.small}}
            color={colors.gray40}
          />
        )}
        renderItem={renderItem}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      minHeight: 44,
      borderTopWidth: 1,
      borderColor: colors.gray40,
      backgroundColor: colors.white,
    },
  });
};

export default MentionBar;
