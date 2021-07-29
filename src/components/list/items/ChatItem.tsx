import React from 'react';
import {StyleSheet} from 'react-native';

import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../../beinComponents/ScreenWrapper';
import {margin, padding} from '~/theme/spacing';
import TextBadge from '../../texts/TextBadge';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import {IConversation} from '~/interfaces/IChat';

const ChatItem: React.FC<IConversation> = ({
  name,
  updatedAt,
  unreadCount,
  lastMessage,
  avatar,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <ScreenWrapper style={styles.container}>
      <HeaderView
        avatar={{source: avatar}}
        firstLabel={name}
        secondLabel={updatedAt}
        thirdLabel={lastMessage}
        style={styles.header}
      />
      {unreadCount > 0 && (
        <TextBadge style={styles.badge} value={unreadCount} />
      )}
    </ScreenWrapper>
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
    header: {
      marginStart: margin.large,
    },
    badge: {
      marginHorizontal: margin.small,
    },
  });
};

export default React.memo(ChatItem);
