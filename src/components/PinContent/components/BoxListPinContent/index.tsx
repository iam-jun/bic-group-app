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
import { dimension, spacing } from '~/theme';
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
    <View style={styles.containerItem}>
      <PinContentItem contentId={item} isAdmin={isAdmin} id={id} />
    </View>

  );

  const renderHeaderComponent = () => (
    <ViewSpacing width={spacing.margin.large} />
  );

  const renderFooterComponent = () => (
    <ViewSpacing width={spacing.padding.large} />
  );

  const renderSeparatorComponent = () => (
    <ViewSpacing width={spacing.margin.large} />
  );

  const keyExtractor = (item) => `pin-content-item-${item}`;

  const renderLoadingView = () => (
    <View style={styles.loadingView} testID="box_list_pin_content.loading_view">
      <ActivityIndicator size="small" color={colors.gray30} />
    </View>
  );

  const renderBoxListPin = () => (
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

  if (!isLoading && (!data || data?.length === 0)) { return <ViewSpacing height={spacing.margin.large} />; }

  return (
    <View>
      {(isLoading && data?.length === 0) ? renderLoadingView() : renderBoxListPin()}
    </View>
  );
};

const MaxWidthItem = dimension.deviceWidth * 0.8;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.purple1,
      marginVertical: spacing.margin.large,
    },
    boxTitle: {
      paddingVertical: spacing.padding.base,
      paddingLeft: spacing.padding.extraLarge,
    },
    loadingView: {
      width: DeviceWidth,
      height: 60,
      alignContent: 'center',
      justifyContent: 'center',
    },
    containerItem: {
      marginBottom: spacing.padding.large,
      height: 280,
      width: MaxWidthItem,
    },
  });
};

export default BoxListPinContent;
