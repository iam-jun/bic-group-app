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
import {useTheme} from 'react-native-paper';

import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import {IMentionUser} from '~/interfaces/IPost';

import {
  checkRunSearch,
  completeMention,
  ICursorPositionChange,
} from '~/beinComponents/inputs/_MentionInput/helper';
import MentionBarItem from '~/beinComponents/inputs/_MentionInput/MentionBar/MentionBarItem';
import Divider from '~/beinComponents/Divider';

interface MentionBarProps {
  style?: StyleProp<ViewStyle>;
  type?: string;
}

const MentionBar: FC<MentionBarProps> = ({
  style,
  type = 'mentionInput',
}: MentionBarProps) => {
  const text = useRef('');
  const cursorPosition = useRef(0);

  const dispatch = useDispatch();
  const {data} = useKeySelector(type);

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-selection-change',
      onCursorPositionChange,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  const onCursorPositionChange = ({
    position,
    value,
    groupIds,
  }: ICursorPositionChange) => {
    text.current = value;
    cursorPosition.current = position;
    checkRunSearch(value.substring(0, position), groupIds, dispatch);
  };

  const onPressItem = (item: IMentionUser) => {
    completeMention({
      item,
      dispatch,
      text: text.current,
      cursorPosition: cursorPosition.current,
    });
  };

  const renderItem = ({item}: any) => {
    return <MentionBarItem data={item} onPress={onPressItem} />;
  };

  if (!data?.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyboardShouldPersistTaps={'handled'}
        ItemSeparatorComponent={() => (
          <Divider
            horizontal
            style={{marginVertical: spacing.margin.small}}
            color={colors.borderFocus}
          />
        )}
        renderItem={renderItem}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      minHeight: 44,
      borderTopWidth: 1,
      borderColor: colors.borderFocus,
      backgroundColor: colors.background,
    },
  });
};

export default MentionBar;
