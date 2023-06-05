import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Button } from '~/baseComponents';
import Image from '~/components/Image';
import MarkdownLink from '../MarkdownLink';
import { margin } from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import useVideoPlayerStore from '~/store/videoPlayer';



const MarkdownImage = ({ src, alt, linkDestination, disableImage }: any) => {
  if (disableImage) return <MarkdownLink href={src}>{src}</MarkdownLink>;
  const actions = useVideoPlayerStore((state) => state.actions);

  const play = () => {
    actions.show({ src: linkDestination, thumbnail: src })
  }


  if (linkDestination) {
    /**
     * Because text formatter is difference between web and mobile
     * we must treat alt props as mediaType
     */
    const mediaType = alt;
    if (mediaType ==='video' ) {
        return (
          <View style={styles.containner}>
            <Image style={styles.image} source={{ uri: src }} />
            <Button
              style={styles.buttonPlay}
              onPress={play}
            >
              <Icon size={60} tintColor={"#D1D4DB"} icon="CirclePlay" />
            </Button>
          </View>

        )
      // other cases will be implemented later
    }
  }

  return <Image style={styles.image} source={src} />

}

const styles = StyleSheet.create({
  containner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    // temporary fixed height
    height: 200,
    marginVertical: margin.base
  },
  buttonPlay: {
    zIndex: 2,
    position: 'absolute',
  },
})

export default MarkdownImage