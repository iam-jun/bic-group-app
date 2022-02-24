import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';

interface Props {
  testID?: string;
  item: any;
  onPress: (item: any) => void;
}

const AtMentionItem = ({testID, item, onPress}: Props) => {
  const dispatch = useDispatch();
  const {highlightItem} = useKeySelector('mentionInput');

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const backgroundColor =
    highlightItem?.username && item?.username === highlightItem?.username
      ? colors.placeholder
      : colors.background;

  const onHoverItem = () => {
    dispatch(actions.sethHighlightItem(item));
  };

  const onLeaveItem = () => {
    dispatch(actions.sethHighlightItem(null));
  };

  const _onPressItem = () => {
    onPress(item);
  };

  const renderMentionAll = () => {
    const backgroundColor =
      highlightItem?.username === 'all'
        ? colors.placeholder
        : colors.background;

    return (
      <Div onMouseOver={onHoverItem} onMouseLeave={onLeaveItem}>
        <TouchableOpacity
          testID="at_mention_item.item_all"
          onPress={_onPressItem}>
          <View style={[styles.mentionAll, {backgroundColor}]}>
            <Text.ButtonBase style={styles.textMentionAll}>
              @all
            </Text.ButtonBase>
            <Text.Subtitle useI18n>common:title_mention_all</Text.Subtitle>
          </View>
        </TouchableOpacity>
      </Div>
    );
  };

  if (item.username === 'all') return renderMentionAll();

  return (
    <Div
      testID={testID}
      style={{backgroundColor}}
      onMouseOver={onHoverItem}
      onMouseLeave={onLeaveItem}>
      <TouchableOpacity style={styles.container} onPress={_onPressItem}>
        <Avatar.Medium
          style={styles.avatar}
          source={item.avatar || item.icon}
          placeholderSource={images.img_user_avatar_default}
        />
        <Text>{item.name || item.fullname}</Text>
      </TouchableOpacity>
    </Div>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.small,
    },
    mentionAll: {
      flexDirection: 'row',
      padding: spacing?.padding.base,
      alignItems: 'center',
    },
    textMentionAll: {
      marginEnd: spacing?.margin.base,
    },
  });
};

export default AtMentionItem;
