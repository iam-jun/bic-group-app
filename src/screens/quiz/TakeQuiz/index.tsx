import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TakeQuizProps {}

const TakeQuiz: React.FC<TakeQuizProps> = () => {
    return (
        <View style={styles.container}>
            <Text>TakeQuiz</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {

    },
});

export default TakeQuiz;
