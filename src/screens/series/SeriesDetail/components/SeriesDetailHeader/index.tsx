/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { dimension, spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import DescriptionSection from '~/components/series/SeriesContent/DescriptionSection';
import Icon from '~/baseComponents/Icon';
import { IPost, IPostAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import { ButtonMarkAsRead, PostImportant } from '~/components/posts';
import { useUserIdAuth } from '~/hooks/auth';
import { navigateToCommunityDetail, navigateToGroupDetail } from '~/router/helper';

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

  const onPressItem = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
      navigateToCommunityDetail({ communityId });
    } else {
      navigateToGroupDetail({ groupId: id, communityId });
    }
  };

  const renderItem = ({ item }) => (
    <Tag
      testID="series_detail_header.audience_tag"
      style={styles.tagContainer}
      type="secondary"
      size="small"
      label={item.name}
      onActionPress={() => onPressItem(item)}
    />
  );

  const keyExtractor = (item) => `audiences_${item.id}`;

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
    id,
    audience,
    title,
    summary,
    coverMedia,
    items,
    setting,
    communities,
    markedReadPost,
    actor,
  } = series || {};
  const { isImportant, importantExpiredAt } = setting || {};
  const userId = useUserIdAuth();
  const isActor = actor?.id == userId;
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const renderImportant = () => (
    <PostImportant
      isImportant={!!isImportant}
      expireTime={importantExpiredAt}
      markedReadPost={markedReadPost}
      listCommunity={communities}
    />
  );

  const renderMarkAsRead = () => (
    <ButtonMarkAsRead
      postId={id}
      markedReadPost={markedReadPost}
      isImportant={isImportant}
      expireTime={importantExpiredAt}
      style={styles.markAsReadView}
      styleBtn={styles.markAsReadBtn}
    />
  );

  return (
    <View style={styles.containerHeader}>
      {renderImportant()}
      <View>
        <Image source={coverMedia?.url} style={styles.img} />
        <View style={styles.mask} />
        <View style={styles.insideView}>
          <View style={styles.row}>
            <Icon
              icon="FileInvoiceSolid"
              size={18}
              tintColor={colors.white}
            />
            <ViewSpacing width={spacing.margin.base} />
            <Text.BodyMMedium color={colors.white}>
              { items?.length }
            </Text.BodyMMedium>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <AudiencesSection audience={audience} />
        <ViewSpacing height={spacing.margin.large} />
        <Text.H2>{title}</Text.H2>
        <DescriptionSection description={summary} style={styles.description} />
        {renderMarkAsRead()}
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
    mask: {
      ...StyleSheet.absoluteFillObject,
      height: 50,
      marginTop: 117,
      opacity: 0.4,
      backgroundColor: colors.black,
    },
    insideView: {
      ...StyleSheet.absoluteFillObject,
      height: 50,
      marginTop: 117,
      paddingHorizontal: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    markAsReadView: {
      paddingHorizontal: 0,
      marginTop: spacing.margin.small,
      marginBottom: -spacing.margin.small,
    },
    markAsReadBtn: {
      borderTopWidth: 0,
    },
  });
};

export default SeriesDetailHeader;
