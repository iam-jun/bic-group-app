import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import SearchMemberView from './components/SearchMemberView';
import MembersContent from './components/MembersContent';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

const CommunityMembers = ({ route }: any) => {
  const { communityId } = route.params;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();

  const [isOpen, setIsOpen] = useState(false);

  const onPressMenu = (item: ICommunityMembers) => {
    // TODO: ADD PRESS MENU
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = React.useCallback(
    () => {
      setIsOpen(false);
    }, [],
  );

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white}>
      <Header titleTextProps={{ useI18n: true }} title="groups:title_members_other" />
      <View style={styles.searchBar}>
        <Pressable
          testID="community_members.search"
          onPress={onPressSearch}
          style={styles.searchAndInvite}
        >
          <View pointerEvents="none">
            <SearchInput placeholder={t('groups:text_search_member')} />
          </View>
        </Pressable>
      </View>

      <MembersContent communityId={communityId} onPressMenu={onPressMenu} />

      <SearchMemberView
        isOpen={isOpen}
        communityId={communityId}
        onClose={onCloseModal}
        onPressMenu={onPressMenu}
        placeholder={t('groups:text_search_member')}
      />
    </ScreenWrapper>
  );
};

export default CommunityMembers;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchAndInvite: {
      flex: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.base,
    },
  });
};
