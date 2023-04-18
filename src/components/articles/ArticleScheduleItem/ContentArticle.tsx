import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { IArticleCover, IAudienceUser, IPostAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { borderRadius } from '~/theme/spacing';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Audiences from './Audiences';

interface ContentArticleProps {
    title: string;
    summary: string;
    coverMedia: IArticleCover;
    actor: IAudienceUser;
    audience: IPostAudience;
    showAvatar: boolean;
}

const ContentArticle: React.FC<ContentArticleProps> = ({
  title,
  summary,
  coverMedia,
  actor,
  audience,
  showAvatar = true,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { url } = coverMedia || {};
  const { avatar, fullname } = actor || {};
  const { rootNavigation } = useRootNavigation();

  const onPressActor = () => {
    if (!actor?.id) return;
    rootNavigation.navigate(mainTabStack.userProfile, { userId: actor?.id });
  };

  return (
    <View style={styles.container}>
      <Text.H4 color={colors.neutral60} numberOfLines={1}>
        {title}
      </Text.H4>
      <View style={styles.boxInfo}>
        {!!url && <Image style={styles.img} source={url} />}
        {!!summary && (
        <View style={styles.boxSummary}>
          <Text.ParagraphM
            numberOfLines={2}
            color={colors.neutral60}
          >
            {summary}
          </Text.ParagraphM>
        </View>
        )}
      </View>
      {showAvatar && (
        <View style={styles.boxActor}>
          <Button
            style={styles.avatar}
            onPress={onPressActor}
          >
            <Avatar.Tiny isRounded source={avatar} />
            <ViewSpacing width={spacing.margin.small} />
            <View style={styles.boxFullName}>
              <Text.BodyXSMedium color={colors.neutral60} numberOfLines={1}>
                {fullname}
              </Text.BodyXSMedium>
            </View>
          </Button>
        </View>
      )}
      <Audiences audience={audience} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
    },
    boxInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.small,
    },
    img: {
      width: 61,
      height: 44,
      borderRadius: borderRadius.small,
      marginRight: 8,
    },
    boxSummary: {
      flex: 1,
    },
    boxActor: {
      marginTop: spacing.margin.small,
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
};

export default ContentArticle;
