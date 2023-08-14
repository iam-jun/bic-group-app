import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import InvitationItem from './InvitationItem';
import Divider from '~/beinComponents/Divider';
import { IGroupedInvitations } from '../store';

interface InvitationBlockProps {
    data: IGroupedInvitations;
}

const InvitationBlock = ({
  data,
}: InvitationBlockProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.BodyMMedium useI18n>
        {data.title}
      </Text.BodyMMedium>
    </View>
  );

  const renderItem = ({ item }: any) => <InvitationItem id={item} groupedId={data.id} />;

  const keyExtractor = (item: any) => item;

  if (data?.data?.length === 0) { return null; }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.data}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <Divider color={colors.gray5} />}
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
    list: {
      flex: 1,
    },
  });
};

export default InvitationBlock;
