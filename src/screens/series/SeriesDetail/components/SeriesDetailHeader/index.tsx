/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { dimension, spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import DescriptionSection from '~/components/series/SeriesContent/DescriptionSection';
import Icon from '~/baseComponents/Icon';
import { IPost, IPostAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

type SeriesDetailHeaderProps = {
  series: IPost;
};

type AudiencesSectionProps = {
  audience: IPostAudience;
};

const AudiencesSection: FC<AudiencesSectionProps> = ({ audience }) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const { groups = [] } = audience || {};
  const theme = useTheme();
  const styles = createStyle(theme);

  const navigateToGroup = (groupId: any, communityId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressItem = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
      navigateToCommunity(communityId);
    } else {
      navigateToGroup(id, communityId);
    }
  };

  const renderItem = ({ item }) => (
    <Tag
      testID="audience-tag"
      style={styles.tagContainer}
      type="secondary"
      size="small"
      label={item.name}
      onActionPress={() => onPressItem(item)}
    />
  );

  const keyExtractor = (item) => `audiences-${item.id}`;

  return (
    <View>
      <Text.H4>{`${t('common:audiences')}:`}</Text.H4>
      <ViewSpacing height={spacing.margin.base} />
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const InfoSection = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.rowInfo}>
      <View style={styles.row}>
        <Icon
          icon="FileInvoiceSolid"
          size={18}
          tintColor={colors.neutral20}
        />
        <ViewSpacing width={spacing.margin.base} />
        <Text.BodyMMedium color={colors.neutral40}>
          124k
        </Text.BodyMMedium>
      </View>
      <View style={styles.row}>
        <Icon
          icon="ClockSolid"
          size={18}
          tintColor={colors.neutral20}
        />
        <ViewSpacing width={spacing.margin.base} />
        <Text.BodyMMedium color={colors.neutral40}>
          145m
        </Text.BodyMMedium>
      </View>
      <View style={styles.row}>
        <Icon
          icon="EyeSolid"
          size={18}
          tintColor={colors.neutral20}
        />
        <ViewSpacing width={spacing.margin.base} />
        <Text.BodyMMedium color={colors.neutral40}>
          192k
        </Text.BodyMMedium>
      </View>
    </View>
  );
};

const SeriesDetailHeader: FC<SeriesDetailHeaderProps> = ({ series }) => {
  const {
    audience, title, summary, coverMedia,
  } = series || {};
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.containerHeader}>
      <Image source={coverMedia?.url} style={styles.img} />
      <View style={styles.container}>
        <AudiencesSection audience={audience} />
        <ViewSpacing height={spacing.margin.large} />
        <Text.H2>{title}</Text.H2>
        <DescriptionSection description={summary} style={styles.description} />
        {/* for the next sprint */}
        {/* <ViewSpacing height={spacing.margin.large} />
        <InfoSection /> */}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;

  return StyleSheet.create({
    containerHeader: {
      backgroundColor: colors.white,
      ...elevations.e2,
      marginBottom: spacing.margin.large,
    },
    container: {
      padding: spacing.padding.large,
    },
    img: {
      height: 167,
      width: dimension.deviceWidth,
    },
    tagContainer: {
      alignSelf: 'baseline',
    },
    description: {
      marginTop: spacing.margin.large,
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default SeriesDetailHeader;
