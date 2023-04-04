import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface PinPostImageProps {

}

const PinPostImage: React.FC<PinPostImageProps> = ({

}) => {
    return (
        <View style={styles.container}>
            <Text>PinPostImage</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});

export default PinPostImage;
