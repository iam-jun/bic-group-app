import React, {FC, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import Icon from '~/beinComponents/Icon';
import {IPostAudience} from '~/interfaces/IPost';
import {useBaseHook} from '~/hooks';
import moment from 'moment';
import {formatDate} from '~/utils/formatData';
import {AppContext} from '~/contexts/AppContext';
import mainStack from '~/router/navigator/MainStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

export interface PostViewHeaderProps {
  audience?: IPostAudience;
  time?: any;
  actor: any;
  onPressHeader?: () => void;
  onPressMenu?: (e: any) => void;
  onPressShowAudiences?: () => void;
}

const PostViewHeader: FC<PostViewHeaderProps> = ({
  audience,
  time,
  actor,
  onPressHeader,
  onPressMenu,
  onPressShowAudiences,
}: PostViewHeaderProps) => {
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {language} = useContext(AppContext);

  const textAudiences = getAudiencesText(audience, t);

  const avatar = actor?.data?.avatar;
  const actorName = actor?.data?.fullname;

  const onPressActor = () => {
    if (actor?.id) {
      rootNavigation.navigate(mainStack.userProfile, {
        userId: actor?.id,
      });
    }
  };

  const renderPostTime = () => {
    if (!time) {
      return null;
    }
    let postTime = '';
    if (time) {
      const dateUtc = moment.utc(time);
      const localDate = dateUtc.local();
      postTime = formatDate(localDate, undefined, language, 2, false) || '';
    }
    return <Text.BodyS color={colors.textSecondary}>{postTime}</Text.BodyS>;
  };

  return (
    <TouchableOpacity
      disabled={!onPressHeader}
      onPress={() => onPressHeader?.()}
      style={styles.headerContainer}>
      <Avatar.UltraLarge source={avatar} style={styles.avatar} />
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={onPressActor}
          style={{alignSelf: 'flex-start'}}>
          <Text.H6>{actorName}</Text.H6>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text.H6S useI18n color={colors.textSecondary} style={styles.textTo}>
            post:to
          </Text.H6S>
          <Text.H6 onPress={onPressShowAudiences}>{textAudiences}</Text.H6>
        </View>
        <View style={styles.rowCenter}>{renderPostTime()}</View>
      </View>
      <View style={{marginRight: spacing?.margin.small}}>
        <Icon
          style={{alignSelf: 'auto'}}
          icon={'EllipsisH'}
          onPress={onPressMenu}
        />
      </View>
    </TouchableOpacity>
  );
};

const getAudiencesText = (aud?: IPostAudience, t?: any) => {
  const limitLength = 25;
  let result = '';
  const {groups = [], users = []} = aud || {};
  const total = groups.length + users.length;
  result = groups?.[0]?.data?.name || users?.[0]?.data?.fullname || '';
  const left = total - 1;
  if (result?.length > limitLength) {
    result = `${result.substr(0, limitLength)}...`;
  } else if (left > 0) {
    result = `${result},...`;
  }
  if (left > 0) {
    result = `${result} +${left} ${t?.('post:other_places')}`;
  }
  return result;
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      paddingTop: spacing?.margin.small,
    },
    rowCenter: {flexDirection: 'row', alignItems: 'center'},
    textTo: {
      marginRight: spacing?.margin.tiny,
    },
    avatar: {
      marginLeft: spacing?.margin.large,
      marginRight: spacing?.margin.base,
    },
  });
};

export default PostViewHeader;
