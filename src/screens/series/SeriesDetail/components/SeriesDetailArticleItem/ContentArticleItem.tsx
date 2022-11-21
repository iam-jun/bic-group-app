/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import { IArticleCover, IAudienceUser } from '~/interfaces/IPost';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import { borderRadius } from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';

type ContentArticleItemProps = {
  actor: IAudienceUser;
  coverMedia?: IArticleCover;
  summary: string;
};

const ContentArticleItem: FC<ContentArticleItemProps> = ({
  actor,
  coverMedia,
  summary,
}) => {
  const { avatar, fullname } = actor || {};
  const { url } = coverMedia || {};
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
        {!!url && <Image style={styles.img} source={url} />}
      </View>
      {!!summary && (
        <View style={styles.summaryView}>
          <Text.ParagraphM color={colors.neutral40}>{summary}</Text.ParagraphM>
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

export default ContentArticleItem;
