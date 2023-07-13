import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Image from '~/components/Image';
import { useBaseHook } from '~/hooks';
import { QuizPost } from '~/interfaces/IQuiz';
import images from '~/resources/images';
import { spacing } from '~/theme';
import showAlert from '~/store/helper/showAlert';
import { useRootNavigation } from '~/hooks/navigation';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

type TakePartInAQuizProps = {
  quiz: QuizPost;
};

const TakePartInAQuiz: FC<TakePartInAQuizProps> = ({ quiz }) => {
  const { title, description } = quiz || {};

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const onStartTakeQuiz = () => {
    // rootNavigation.navigate(quizStack.takeQuiz, { quizId:  });
  };

  const onPress = () => {
    showAlert({
      title: t('quiz:title_alert_take_quiz'),
      content: t('quiz:content_alert_take_quiz'),
      cancelBtn: true,
      confirmLabel: t('quiz:btn_start'),
      onConfirm: onStartTakeQuiz,
    });
  };

  return (
    <Button onPress={onPress}>
      <View style={styles.container}>
        <Image style={styles.img} source={images.img_thumbnail_take_part_in_a_quiz} />
        <ViewSpacing width={spacing.margin.small} />
        <View style={{ flex: 1 }}>
          <Text.SubtitleM
            color={!!title ? colors.neutral40 : colors.neutral20}
            numberOfLines={1}
          >
            {!!title ? title : t('quiz:empty_title_quiz')}
          </Text.SubtitleM>
          <Text.BodyXS
            color={!!description ? colors.neutral40 : colors.neutral20}
            numberOfLines={2}
          >
            {!!description ? description : t('quiz:empty_description_quiz')}
          </Text.BodyXS>
        </View>
        <ViewSpacing width={spacing.margin.small} />
        <Icon size={24} tintColor={colors.neutral40} icon="ChevronRight" />
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
      padding: spacing.padding.large,
    },
    img: {
      width: 64,
      height: 64,
    },
  });
};

export default TakePartInAQuiz;
