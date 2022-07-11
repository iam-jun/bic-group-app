import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';

interface Props {
  testID?: string;
  item: any;
  onPress: (item: any) => void;
}

const AtMentionItem = ({item, onPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const _onPressItem = () => {
    onPress(item);
  };

  const renderMentionAll = () => {
    return (
      <View>
        <TouchableOpacity
          testID="at_mention_item.item_all"
          onPress={_onPressItem}>
          <View style={styles.mentionAll}>
            <Text.ButtonBase style={styles.textMentionAll}>
              @all
            </Text.ButtonBase>
            <Text.Subtitle useI18n>common:title_mention_all</Text.Subtitle>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (item.username === 'all') return renderMentionAll();

  return (
    <View testID={'at_mention_item'} style={styles.mentionContainer}>
      <TouchableOpacity
        style={styles.container}
        onPress={_onPressItem}
        testID={'at_mention_item.touchable'}>
        <Avatar.Medium
          style={styles.avatar}
          source={item.avatar || item.icon}
          placeholderSource={images.img_user_avatar_default}
        />
        <Text>{item.name || item.fullname}</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.small,
    },
    mentionContainer: {
      backgroundColor: colors.background,
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
