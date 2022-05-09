import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import actions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import ListView from '~/beinComponents/list/ListView';
import {ITheme} from '~/theme/interfaces';
import {ICommunityMembers} from '~/interfaces/ICommunity';

const PreviewMembers = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {id: communityId, user_count} = infoDetail;
  const previewMembers = useKeySelector(groupsKeySelector.previewMembers);

  useEffect(() => {
    dispatch(
      actions.getCommunityMembers({
        communityId,
        preview_members: true,
      }),
    );
  }, [communityId]);

  const renderItem = ({item}: {item: ICommunityMembers}) => {
    return <Avatar.Small isRounded source={item.avatar} />;
  };

  const renderMembersDescription = () => {
    let memberText: string;
    if (previewMembers.length === 1) {
      memberText = `${previewMembers[0]?.fullname} ${i18next.t(
        'communities:text_is_member',
      )}`;
    } else {
      memberText = `${previewMembers[0]?.fullname} ${i18next.t(
        'post:and',
      )} ${i18next.t('communities:text_other_member', {
        count: user_count - 1,
      })}`;
    }

    return (
      <Text.BodyS
        color={theme.colors.textSecondary}
        style={styles.memberDescriptionText}>
        {memberText}
      </Text.BodyS>
    );
  };

  return (
    <>
      <ListView
        horizontal
        data={previewMembers}
        renderItem={renderItem}
        listStyle={styles.listStyle}
        scrollEnabled={false}
      />
      {renderMembersDescription()}
    </>
  );
};

export default PreviewMembers;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    listStyle: {
      margin: spacing.margin.large,
    },
    memberDescriptionText: {
      marginHorizontal: spacing.margin.large,
    },
  });
};
