import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Image from '~/components/Image';
import { QuizPost } from '~/interfaces/IQuiz';
import images from '~/resources/images';
import { spacing } from '~/theme';

type TakePartInAQuizProps = {
  quiz: QuizPost;
};

const TakePartInAQuiz: FC<TakePartInAQuizProps> = ({ quiz }) => {
  const { title, description } = quiz;

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const onPress = () => {
    // do something
  };

  return (
    <Button onPress={onPress}>
      <View style={styles.container}>
        <Image style={styles.img} source={images.img_thumbnail_take_part_in_a_quiz} />
        <ViewSpacing width={spacing.margin.small} />
        <View style={{ flex: 1 }}>
          <Text.SubtitleM color={colors.neutral40} numberOfLines={1}>
            {title}
          </Text.SubtitleM>
          {!!description && (
            <Text.BodyXS color={colors.neutral40} numberOfLines={2}>
              {description}
            </Text.BodyXS>
          )}
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
