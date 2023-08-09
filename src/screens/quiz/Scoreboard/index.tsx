import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import useScoreboardStore from './store';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Summary from './components/Summary';
import UsersParticipants from './components/UsersParticipants';

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

  const actions = useScoreboardStore((state) => state.actions);

  useEffect(() => {
    getData();
  }, [contentId]);

  const getData = () => {
    actions.getQuizSummary(contentId);
    actions.getUsersParticipants({ contentId });
  };

  const renderContent = () => {
    // if (loading) {}

    return (
      <View>
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
  container: {}
});

export default Scoreboard;
