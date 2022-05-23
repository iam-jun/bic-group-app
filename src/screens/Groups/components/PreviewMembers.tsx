import {StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import ListView from '~/beinComponents/list/ListView';
import {ITheme} from '~/theme/interfaces';
import {IPreviewMember} from '~/interfaces/ICommunity';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const PreviewMembers = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {user_count, members} = infoDetail;

  const renderItem = ({item}: {item: IPreviewMember}) => {
    return <Avatar.Small isRounded source={item.avatar} />;
  };

  const renderMembersDescription = () => {
    let memberText: string;
    if (members?.length === 1) {
      memberText = `${members[0]?.fullname} ${i18next.t(
        'communities:text_is_member',
      )}`;
    } else {
      memberText = `${members[0]?.fullname} ${i18next.t(
        'post:and',
      )} ${i18next.t('communities:text_other_member', {
        count: user_count - 1,
      })}`;
    }

    return (
      <Text.BodyS
        testID="preview_members.description"
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
        data={members}
        renderItem={renderItem}
        listStyle={styles.listStyle}
        scrollEnabled={false}
        renderItemSeparator={() => <ViewSpacing width={2} />}
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
