import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import actions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import ListView from '~/beinComponents/list/ListView';
import {ITheme} from '~/theme/interfaces';

const PreviewMembers = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {id: communityId} = infoDetail;
  const previewMembers = useKeySelector(groupsKeySelector.previewMembers);

  useEffect(() => {
    dispatch(
      actions.getCommunityMembers({
        communityId,
        preview_members: true,
        params: {limit: 10},
      }),
    );
  }, [communityId]);

  const renderItem = ({item}: any) => {
    return <Avatar.Small isRounded source={item.avatar} />;
  };

  return (
    <ListView
      horizontal
      data={previewMembers}
      renderItem={renderItem}
      listStyle={styles.listStyle}
      scrollEnabled={false}
    />
  );
};

export default PreviewMembers;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    listStyle: {
      margin: spacing.margin.large,
    },
  });
};
