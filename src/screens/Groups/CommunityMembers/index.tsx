import {StyleSheet, View, Pressable} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {ITheme} from '~/theme/interfaces';

import SearchMemberView from './SearchMemberView';
import MembersContent from './MembersContent';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import {useBaseHook} from '~/hooks';

const CommunityMembers = ({route}: any) => {
  const {communityId} = route.params;

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();

  const [isOpen, setIsOpen] = useState(false);

  const onPressMenu = (item: ICommunityMembers) => {
    // TODO: ADD PRESS MENU
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'groups:title_members'} />
      <View style={styles.searchBar}>
        <Pressable
          testID="community_members.search"
          onPress={onPressSearch}
          style={styles.searchAndInvite}>
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
