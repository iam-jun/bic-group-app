import React from 'react';
import {StyleSheet} from 'react-native';
import {
  grey2 as BACKGROUND_COLOR,
  grey4 as ICON_CORLOR,
  grey6 as TEXT_COLOR,
} from '~/theme/colors';
import Icon from '../../Icon';
import ScreenWrapper from '~/components/ScreenWrapper';
import Text from '../../texts/Text';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import Avatar from '~/components/Avatar';
import {IUser} from '~/interfaces/IAuth';
import {margin, padding} from '~/theme/spacing';
import commonActions from '~/constants/commonActions';

export interface Props {
  user?: IUser;
  name?: string;
  onActionPress?: Function;
}

const TagItem: React.FC<Props> = ({user, name, onActionPress}) => {
  const theme: IObject<any> = useTheme();
  return (
    <ScreenWrapper
      style={[styles.container, {backgroundColor: theme.colors.tag}]}>
      {user && <Avatar style={styles.avatar} user={user} size="small" />}
      <Text primary={styles.textStyle} bold>
        {name || user?.name}
      </Text>
      {onActionPress && (
        <Icon
          tintColor={ICON_CORLOR}
          size={12}
          icon="iconClose"
          onPress={() => onActionPress(commonActions.removeTag)}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginEnd: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: padding.small,
    paddingVertical: padding.small,
  },
  textStyle: {
    color: TEXT_COLOR,
    fontSize: 10,
  },
  avatar: {
    marginHorizontal: margin.tiny,
  },
});

export default TagItem;
