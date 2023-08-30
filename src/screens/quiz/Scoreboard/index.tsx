import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import useScoreboardStore from './store';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Summary from './components/Summary';
import UsersParticipants from './components/UsersParticipants';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import images from '~/resources/images';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface ScoreboardProps {
  route?: {
    params?: {
      contentId: string;
    };
  };
}

const Scoreboard: React.FC<ScoreboardProps> = (props) => {
  const { route } = props;
  const { contentId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { refreshing, data } = useScoreboardStore((state) => state.userParticipants);
  const actions = useScoreboardStore((state) => state.actions);
  const reset = useScoreboardStore((state) => state.reset);

  useEffect(() => {
    getData();

    return () => reset();
  }, [contentId]);

  const getData = () => {
    actions.getQuizSummary(contentId);
    actions.getUsersParticipants({ contentId });
  };

  const renderContent = () => {
    if (refreshing) {
      return (
        <View style={styles.centerView}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!refreshing && (!data || data.length === 0)) {
      return (
        <View style={styles.emptyView}>
          <Image
            resizeMode="contain"
            source={images.img_empty_result_quiz}
            style={styles.imgEmpty}
          />
          <Text.H3 color={colors.neutral60} useI18n>
            quiz:title_empty_result
          </Text.H3>
          <ViewSpacing height={spacing.margin.small} />
          <Text.BodyS color={colors.neutral60} useI18n style={styles.textEmpty}>
            quiz:text_empty_result
          </Text.BodyS>
        </View>
      );
    }

    return (
      <View style={styles.contentView}>
        <Summary />
        <UsersParticipants contentId={contentId} />
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="score_board">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_score_board"
      />
      {renderContent()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    alignItems: 'center',
    marginTop: 132,
    paddingHorizontal: 64,
  },
  textEmpty: {
    textAlign: 'center',
  },
  imgEmpty: {
    width: 100,
    aspectRatio: 1,
    marginBottom: spacing.margin.base,
  },
});

export default Scoreboard;
