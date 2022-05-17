import {StyleSheet, View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {ITheme} from '~/theme/interfaces';
import actions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import SearchMemberModal from './SearchMemberModal';
import ContentData from './ContentData';

const CommunityMembers = ({route}: any) => {
  const {communityId} = route.params;
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const [sectionList, setSectionList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const {loading, canLoadMore, communityAdmins, members} = useKeySelector(
    groupsKeySelector.communityMembers,
  );

  const getCommunityMembers = () => {
    dispatch(actions.getCommunityMembers({communityId}));
  };

  const resetCommunityMembers = () => {
    dispatch(actions.resetCommunityMembers());
  };

  useEffect(() => {
    console.log('effect');
    getCommunityMembers();

    return () => {
      resetCommunityMembers();
    };
  }, [communityId]);

  useEffect(() => {
    console.log('member data:', members?.data?.length);

    const newSectionList: any = [
      {
        title: 'Admins',
        data: communityAdmins.data,
        total: communityAdmins.total,
      },
      {
        title: 'Members',
        data: members.data,
        total: members.total,
      },
    ];

    setSectionList(newSectionList);
  }, [communityAdmins.data, members.data]);

  const onLoadMore = () => {
    console.log('onLoadMore');
    //getCommunityMembers();
  };

  const onRefresh = () => {
    console.log('onRefresh');
    resetCommunityMembers();
    //getCommunityMembers();
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onPressChat = () => {
    // TODO: add navigate to chat
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'groups:title_members'} />
      <View style={styles.searchBar}>
        <Pressable onPress={onPressSearch} style={styles.searchAndInvite}>
          <View pointerEvents="none">
            <SearchInput
              testID="community_members.search"
              placeholder={i18next.t('groups:text_search_member')}
            />
          </View>
        </Pressable>
      </View>

      <ContentData
        keyId={'communitymembers'}
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        onPressChat={onPressChat}
      />

      <SearchMemberModal
        isOpen={isOpen}
        communityId={communityId}
        onClose={onCloseModal}
        placeholder={i18next.t('groups:text_search_member')}
        onPressChat={onPressChat}
      />
    </ScreenWrapper>
  );
};

export default CommunityMembers;

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchAndInvite: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.base,
    },
  });
};
