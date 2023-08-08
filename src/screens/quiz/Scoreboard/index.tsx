import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import useScoreboardStore from './store';

interface ScoreboardProps {
  route?: {
    params?: {
      quizId: string;
    };
  };
}

const Scoreboard: React.FC<ScoreboardProps> = (props) => {
  const { route } = props;
  const { quizId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const actions = useScoreboardStore((state) => state.actions);

  useEffect(() => {
    actions.getQuizSummary(quizId);
  }, [quizId]);  

  return (
    <View style={styles.container}>
      <Text>Scoreboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default Scoreboard;
