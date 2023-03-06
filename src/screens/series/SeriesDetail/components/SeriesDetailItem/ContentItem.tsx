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

type ContentItemProps = {
  item: IPost;
};

const ContentItem: FC<ContentItemProps> = ({
  item,
}) => {
  const {
    actor, coverMedia, summary, content, media,
  } = item || {};
  const { avatar, fullname } = actor || {};
  const { url } = coverMedia || {};
  const { images: imagesPost } = media || {};
  const coverUrlItem = item?.type === PostType.ARTICLE ? url : imagesPost?.[0]?.url;
  const summaryItem = item?.type === PostType.ARTICLE ? summary : content;

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const onPressActor = () => {
    if (!actor?.id) return;

    const payload = { userId: actor.id };
    rootNavigation.navigate(mainTabStack.userProfile, payload);
  };

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.actor}>
          <Button
            style={styles.avatar}
            onPress={onPressActor}
          >
            <Avatar.Small isRounded source={avatar} />
            <ViewSpacing width={spacing.margin.small} />
            <View style={{ flex: 1 }}>
              <Text.BodyXSMedium color={colors.neutral60} numberOfLines={1}>
                {fullname}
              </Text.BodyXSMedium>
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
    avatar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default ContentItem;
