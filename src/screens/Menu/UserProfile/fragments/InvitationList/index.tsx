import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { spacing } from '~/theme';
import useMyInvitationsStore from './store';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import images from '~/resources/images';
import Image from '~/components/Image';
import Divider from '~/beinComponents/Divider';
import InvitationBlock from './component/InvitationBlock';

const InvitationList = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const actions = useMyInvitationsStore((state) => state.actions);
  const data = useMyInvitationsStore((state) => state.groupedInvitations);
  const loading = useMyInvitationsStore((state) => state.loading);
  const hasNextPage = useMyInvitationsStore((state) => state.hasNextPage);

  useEffect(() => {
    actions.getInvitations(true);
  }, []);

  const goToInvitationSettings = () => {
    rootNavigation.navigate(menuStack.invitationPrivacy);
  };

  const onLoadMore = () => {
    if (!hasNextPage || loading) return;
    actions.getInvitations();
  };

  const renderHeader = () => (
    <View testID="invitation_list.header">
      <View style={styles.headerContainer}>
        <View style={[styles.row, styles.textContainer]}>
          <Text.H4 useI18n>
            user:user_tab_types:title_invitations
          </Text.H4>
          <Text.LinkS
            testID="invitation_list.text_link_to_invitation_settings"
            useI18n
            onPress={goToInvitationSettings}
          >
            user:text_invitation_privacy_settings
          </Text.LinkS>
        </View>
        <ViewSpacing height={spacing.margin.tiny} />
        <Text.BodyM useI18n>
          user:invitation_description
        </Text.BodyM>
      </View>
      <Divider color={colors.gray5} size={spacing.padding.large} />
    </View>
  );

  const renderItem = ({ item }: any) => <InvitationBlock data={item} />;

  const keyExtractor = (item: any, index: number) => `${index}_ ${item?.title}`;

  const renderFooter = () => {
    if (!loading || !hasNextPage) {
      return null;
    }
    return <LoadingIndicator testID="invitation_list.loading" style={styles.loading} />;
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View
        testID="invitation_list.box_empty"
        style={styles.boxEmpty}
      >
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          user:text_no_invitations_found
        </Text.BodyS>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <Divider color={colors.gray5} size={spacing.padding.large} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      justifyContent: 'space-between',
    },
    loading: {
      marginTop: spacing.margin.large,
    },
    boxEmpty: {
      alignItems: 'center',
      marginTop: spacing.margin.base,
      paddingVertical: 32,
    },
    imgEmpty: {
      width: 100,
      aspectRatio: 1,
      marginBottom: spacing.margin.large,
    },
    list: {
      flex: 1,
    },
  });
};

export default InvitationList;
