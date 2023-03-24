/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import { IPost, PostType } from '~/interfaces/IPost';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Image from '~/beinComponents/Image';
import { borderRadius } from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import images from '~/resources/images';
import DeactivatedView from '~/components/DeactivatedView';
import { escapeMarkDown } from '~/utils/formatter';
import { getSummaryPostItemInSeires, getTitlePostItemInSeries } from '~/helpers/common';

type ContentItemProps = {
  item: IPost;
};

const ContentItem: FC<ContentItemProps> = ({
  item,
}) => {
  const {
    actor, coverMedia, summary, content, media,
  } = item || {};
  const { avatar, fullname, isDeactivated } = actor || {};
  const { url } = coverMedia || {};
  const { images: imagesPost } = media || {};
  const coverUrlItem = item?.type === PostType.ARTICLE ? url : imagesPost?.[0]?.url;
  const escapeMarkDownContent = escapeMarkDown(content);
  const titlePost = getTitlePostItemInSeries(escapeMarkDownContent);
  const summaryPost = getSummaryPostItemInSeires(escapeMarkDownContent, titlePost);

  const summaryItem = item?.type === PostType.ARTICLE ? summary : summaryPost;

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const onPressActor = () => {
    if (!actor?.id || isDeactivated) return;

    const payload = { userId: actor.id };
    rootNavigation.navigate(mainTabStack.userProfile, payload);
  };

  const colorFullName = isDeactivated ? colors.grey40 : colors.neutral60;

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.actor}>
          <Button
            style={styles.avatarContainer}
            onPress={onPressActor}
          >
            <Avatar.Small style={styles.avatar} isRounded source={avatar} />
            <ViewSpacing width={spacing.margin.small} />
            <View style={styles.fullnameContainer}>
              <Text.BodyXSMedium color={colorFullName} numberOfLines={1}>
                {fullname}
              </Text.BodyXSMedium>
              {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
            </View>
          </Button>
        </View>
        {!!coverUrlItem ? <Image style={styles.img} source={coverUrlItem} />
          : <Image style={styles.img} source={images.no_image_avalable} />}
      </View>
      {!!summaryItem && (
        <View style={styles.summaryView}>
          <Text.ParagraphM color={colors.neutral40} numberOfLines={4}>
            { summaryItem }
          </Text.ParagraphM>
        </View>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    actor: {
      flex: 1,
      flexDirection: 'row',
      marginRight: spacing.margin.small,
    },
    img: {
      width: 120,
      height: 80,
      borderRadius: borderRadius.small,
    },
    summaryView: {
      marginTop: spacing.margin.large,
    },
    avatarContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      alignSelf: 'flex-start',
    },
    fullnameContainer: {
      flex: 1,
    },
    deactivatedView: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default ContentItem;
