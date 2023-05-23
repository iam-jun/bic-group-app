import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import NoContent from '~/../assets/images/no_content.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import { useRootNavigation } from '~/hooks/navigation';
import Header from '~/beinComponents/Header';
import { IErrorContent } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';

interface ContentNoPermissionProps {
  onContentLayout?: () => void;
  data: IErrorContent;
}

const ContentNoPermission: React.FC<ContentNoPermissionProps> = ({
  onContentLayout,
  data,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { message, requireGroups = [] } = data || {};

  const goToGroupDetail = (groupId, communityId) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const goToCommunityDetail = (communityId) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const goToAudienceDetail = (item) => {
    const { id, communityId, isCommunity } = item || {};

    if (isCommunity && communityId) {
      goToCommunityDetail(communityId);
    } else {
      goToGroupDetail(id, communityId);
    }
  };

  const renderRequiredGroups = () => {
    if (!requireGroups || requireGroups?.length === 0) return null;

    return requireGroups?.map((item, index) => (
      <Text.H6
        testID={`content_no_permission.text_group_${item?.id}`}
        key={`required_groups_${item?.id}`}
        onPress={() => goToAudienceDetail(item)}
      >
        {item?.name}
        {index === Number(requireGroups?.length) - 1 ? '.' : ', '}
      </Text.H6>
    ));
  };

  return (
    <View
      testID="content_no_permission"
      style={styles.container}
      onLayout={onContentLayout}
    >
      <Header removeBorderAndShadow />
      <View style={styles.content}>
        <SVGIcon source={NoContent} width={100} height={86} />
        <Text.H3 style={styles.title} useI18n>
          common:content_no_permission:title
        </Text.H3>
        <Text.BodyS style={styles.message}>
          {message}
          {requireGroups?.length > 0 && ': '}
        </Text.BodyS>
        <Text.H6 style={styles.textGroups}>{renderRequiredGroups()}</Text.H6>
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingTop: 140,
      paddingHorizontal: 64,
      alignItems: 'center',
      backgroundColor: colors.white,
      flex: 1,
    },
    title: {
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      marginTop: spacing.margin.xSmall,
    },
    textGroups: {
      marginTop: spacing.margin.tiny,
      textAlign: 'center',
    },
  });
};

export default ContentNoPermission;
