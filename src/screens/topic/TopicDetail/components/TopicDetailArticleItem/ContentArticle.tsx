import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IArticleCover, IAudienceUser } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { borderRadius } from '~/theme/spacing';
import { spacing } from '~/theme';

interface ContentArticleProps {
    id: string;
    summary: string;
    coverMedia?: IArticleCover;
    actor?: IAudienceUser;
}

const ContentArticle: React.FC<ContentArticleProps> = ({
  id,
  summary,
  coverMedia,
  actor,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { url } = coverMedia || {};
  const { avatar, fullname } = actor || {};
  const { rootNavigation } = useRootNavigation();

  const onPressActor = () => {
    if (!actor?.id) return;
    rootNavigation.navigate(mainTabStack.userProfile, { userId: actor?.id });
  };

  const goToArticleContentDetail = () => {
    rootNavigation.replace(
      articleStack.articleContentDetail, { articleId: id },
    );
  };

  return (
    <View style={styles.container}>
      <Button style={styles.btnContent} onPress={goToArticleContentDetail}>
        {!!summary && (
        <View style={styles.boxSummary}>
          <Text.ParagraphM color={colors.neutral60}>
            {summary}
          </Text.ParagraphM>
        </View>
        )}
        {!!url && <Image style={styles.img} source={url} />}
      </Button>
      <View style={styles.actor}>
        <Button
          style={styles.avatar}
          onPress={onPressActor}
        >
          <Avatar.Small isRounded source={avatar} />
          <ViewSpacing width={spacing.margin.small} />
          <View style={styles.boxFullName}>
            <Text.BodyS color={colors.neutral60} numberOfLines={1}>
              {fullname}
            </Text.BodyS>
          </View>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.margin.small,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.padding.small,
    marginBottom: spacing.margin.small,
  },
  img: {
    width: 120,
    height: 80,
    borderRadius: borderRadius.small,
  },
  boxSummary: {
    flex: 1,
    marginRight: spacing.margin.small,
  },
  actor: {
    flex: 1,
    flexDirection: 'row',
    marginRight: spacing.margin.small,
  },
  avatar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxFullName: {
    flex: 1,
  },
});

export default ContentArticle;
