import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Container, NavigationHeader, ScreenWrapper, Text} from '~/components';
import {useDispatch} from 'react-redux';
import useGroups from '~/hooks/groups';
import groupsActions from '~/screens/Groups/redux/actions';
import ListView from '~/beinComponents/list/ListView';
import {IObject} from '~/interfaces/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';

interface GroupsProps {}

const Groups: React.FC<GroupsProps> = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);

  const groupsData = useGroups();
  const {loadingJoinedGroups, joinedGroups} = groupsData;

  useEffect(() => {
    dispatch(groupsActions.getJoinedGroups(undefined));
  }, []);

  const onPressRight = () => {
    alert('press search');
  };

  return (
    <ScreenWrapper isFullView={true}>
      <NavigationHeader
        title="Groups"
        rightIcon="iconSearch"
        rightPress={onPressRight}
      />
      <Container style={{flex: 1}}>
        <ListView
          type={'flatGroups'}
          loading={loadingJoinedGroups}
          data={joinedGroups}
          isFullView
          // renderItemSeparator={() => null}
        />
      </Container>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  return StyleSheet.create({});
};

export default Groups;
