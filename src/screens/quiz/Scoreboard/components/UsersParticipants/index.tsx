import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';

interface UsersParticipantsProps {

}

const UsersParticipants: React.FC<UsersParticipantsProps> = ({  }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  

  return (
    <View style={styles.container}>
      <Text>UsersParticipants</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
});

export default UsersParticipants;
