import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import usePinContentStore from '../../store';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import PinContentItem from './components/PinContentItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';

const DeviceWidth = Dimensions.get('window').width;

interface BoxListPinContentProps {
  id: string;
}

const BoxListPinContent: React.FC<BoxListPinContentProps> = ({ id }) => {
  const { groupPinContent } = usePinContentStore((state) => state);
  const { data, isLoading } = groupPinContent?.[id] || {};
  const { shouldHavePermission } = useMyPermissionsStore(
    (state) => state.actions,
  );
  const isAdmin = shouldHavePermission(id, [
    PermissionKey.FULL_PERMISSION,
    PermissionKey.PIN_CONTENT,
  ]);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const renderItem = ({ item }) => (
    <PinContentItem contentId={item} isAdmin={isAdmin} id={id} />
  );

  const renderHeaderComponent = () => {
    if (isLoading && data?.length === 0) return null;

    return <ViewSpacing width={spacing.margin.large} />;
  };

  const renderFooterComponent = () => {
    if (!isLoading && data?.length !== 0) {
      return <ViewSpacing width={spacing.padding.large} />;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.gray30} />
      </View>
    );
  };

  const renderSeparatorComponent = () => (
    <ViewSpacing width={spacing.margin.large} />
  );

  const keyExtractor = (item) => `pin-content-item-${item}`;

  if (!isLoading && (!data || data?.length === 0)) { return <ViewSpacing height={spacing.margin.large} />; }

  return (
    <View style={styles.container}>
      <View style={styles.boxTitle}>
        <Text.SubtitleM useI18n color={colors.neutral40}>
          pin:list_pin_content_title
        </Text.SubtitleM>
      </View>
      <FlatList
        testID="box_list_pin_content.flatlist"
        horizontal
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        ItemSeparatorComponent={renderSeparatorComponent}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        removeClippedSubviews
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.purple1,
      paddingBottom: spacing.padding.large,
      height: 280,
      marginVertical: spacing.margin.large,
    },
    boxTitle: {
      paddingVertical: spacing.padding.base,
      paddingLeft: spacing.padding.extraLarge,
    },
    footer: {
      flex: 1,
      width: DeviceWidth,
      height: 280,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });
};

export default BoxListPinContent;
