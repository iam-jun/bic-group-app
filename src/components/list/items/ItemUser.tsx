import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from '../../texts/Text';
import {spacing} from '~/theme';
import {IObject} from '~/interfaces/common';
import Avatar from '../../Avatar';
import {IUser} from '~/interfaces/IAuth';

const ItemUser: React.FC<IUser> = ({id, name, avatar, online, role}) => {
  const theme: IObject<any> = useTheme();

  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.avatarView}>
        <Avatar user={{name, avatar}} />
        {online && <View style={styles.dot} />}
      </View>
      <View>
        <Text h5 bold>
          {name || id}
        </Text>
        <Text>{role}</Text>
      </View>
    </View>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.padding.base,
    },
    avatarView: {
      marginEnd: spacing.margin.base,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 100,
      backgroundColor: 'green',
      position: 'absolute',
      bottom: 3,
      right: -2,
      borderWidth: 2,
      borderColor: colors.bgColor,
    },
  });
};

export default ItemUser;
