import React from 'react';
import {View, StyleSheet} from 'react-native';

import Avatar from '~/components/Avatar';
import HorizontalView from '~/components/layout/HorizontalView';
import Text from '~/components/texts/Text';
import {margin} from '~/theme/spacing';
import Icon from '../../Icon';
import {IUser} from "~/interfaces/IAuth";

export interface Props {
  user: IUser;
  content: string;
  createdAt: string;
}

const NotificationItem: React.FC<Props> = ({user, content, createdAt}) => {
  return (
    <View style={styles.container}>
      <HorizontalView>
        <Avatar user={user} size="base" />

        <View style={styles.content}>
          <Text style={styles.text} maxLength={120}>
            {content}
          </Text>
          <Text style={styles.date}>{createdAt}</Text>
        </View>

        <Icon style={styles.iconOptions} icon="iconOptions" size={25} />
      </HorizontalView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  text: {
    marginEnd: 55,
    fontSize: 16,
  },
  content: {
    marginStart: margin.small,
    flexShrink: 1,
  },
  date: {
    marginTop: margin.tiny,
    fontSize: 11,
    color: 'gray',
  },
  iconOptions: {
    position: 'absolute',
    top: margin.large,
    right: margin.large,
    zIndex: 99,
  },
});

export default NotificationItem;
