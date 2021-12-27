import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';

const AtMentionItem = ({item, onPressItem}: any) => {
  const dispatch = useDispatch();
  const highlightItem = useKeySelector('mentionInput.highlightItem');

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const backgroundColor =
    highlightItem?.id && item?.id === highlightItem?.id
      ? colors.placeholder
      : colors.background;

  const onHoverItem = () => {
    dispatch(actions.sethHighlightItem(item));
  };

  const onLeaveItem = () => {
    dispatch(actions.sethHighlightItem(null));
  };

  const _onPressItem = () => {
    onPressItem(item);
  };

  return (
    <Div
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
  });
};

export default AtMentionItem;
