import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';

interface SummaryProps {

}

const Summary: React.FC<SummaryProps> = ({  }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;


  return (
    <View style={styles.container}>
      <Text>Summary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
});

export default Summary;
