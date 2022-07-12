import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import Icon from '~/beinComponents/Icon';
import {IPostAudience} from '~/interfaces/IPost';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import modalActions from '~/store/modal/actions';
import TimeView from '~/beinComponents/TimeView';
import {useKeySelector} from '~/hooks/selector';

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
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const textAudiences = getAudiencesText(audience, t);

  const avatar = actor?.avatar;
  const actorName = actor?.fullname;

  const onPressActor = (e: any) => {
    if (!actor.id) return;

    const payload = {
      userId: actor.id,
      position: {x: e?.pageX, y: e?.pageY},
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  return (
    <TouchableOpacity
      testID={'post_view_header'}
      disabled={!isInternetReachable || !onPressHeader}
      onPress={() => onPressHeader?.()}
      style={styles.headerContainer}>
      <TouchableOpacity
        disabled={!isInternetReachable}
        onPress={onPressActor}
        style={styles.avatar}>
        <Avatar.Large isRounded source={avatar} />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <TouchableOpacity
          disabled={!isInternetReachable}
          onPress={onPressActor}
          style={{alignSelf: 'flex-start'}}>
          <Text.BodySM testID="post_view_header.actor">{actorName}</Text.BodySM>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text.BodySM
            useI18n
            color={colors.textSecondary}
            style={styles.textTo}>
            post:to
          </Text.BodySM>
          <Text.BodySM
            testID={'post_view_header.audiences'}
            onPress={!isInternetReachable ? undefined : onPressShowAudiences}>
            {textAudiences}
          </Text.BodySM>
        </View>
        <View style={styles.rowCenter}>
          <TimeView
            textProps={{variant: 'h6'}}
            style={{fontSize: 11}}
            time={time}
          />
        </View>
      </View>
      <View style={{marginRight: spacing?.margin.small}}>
        <Icon
          style={{alignSelf: 'auto'}}
          icon={'Ellipsis'}
          testID={'post_view_header.menu'}
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
  result = groups?.[0]?.name || users?.[0]?.fullname || '';
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
      marginTop: spacing?.margin.tiny,
      marginLeft: spacing?.margin.large,
      marginRight: spacing?.margin.base,
    },
  });
};

export default PostViewHeader;
