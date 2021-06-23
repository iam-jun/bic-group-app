import React from 'react';
import {StyleSheet} from 'react-native';

import HeaderView from '../../Header/HeaderView';
import ThemeView from '../../ThemeView';
import {margin, padding} from '~/theme/configs/spacing';
import TextBadge from '../../Text/TextBadge';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import {IConversation} from '~/store/chat/interfaces';

const ChatItem: React.FC<IConversation> = ({
  name,
  updatedAt,
  unreadCount,
  lastMessage,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <ThemeView style={styles.container}>
      <HeaderView
        avatar={{user: {name}, size: 'large'}}
        firstLabel={name}
        secondLabel={updatedAt}
        thirdLabel={lastMessage}
        style={styles.header}
      />
      {unreadCount > 0 && (
        <TextBadge style={styles.badge} value={unreadCount} />
      )}
    </ThemeView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: margin.base,
      paddingHorizontal: padding.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 12,
    },
    header: {},
    badge: {
      marginHorizontal: margin.small,
    },
  });
};

export default React.memo(ChatItem);
