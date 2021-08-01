import React from 'react';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Container from '~/components/Container';
import {getRandomInt} from '~/utils/generator';

const LoadingMessages = () => {
  const count = getRandomInt(1, 3); // lines count

  return (
    <Container isFullView fluid>
      {Array.from(Array(20).keys()).map((item, index) => (
        <Placeholder
          key={`loading-message-media-${index}`}
          Animation={Fade}
          style={{
            marginVertical: 6,
            marginHorizontal: 15,
            borderRadius: 4,
          }}
          Left={() => (
            <PlaceholderMedia
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
              }}
            />
          )}>
          {Array.from(Array(count).keys()).map((item, index) => (
            <PlaceholderLine
              key={`loading-message-line-${index}`}
              style={{marginTop: 1}}
              width={getRandomInt(3, 7) * 10}
            />
          ))}
        </Placeholder>
      ))}
    </Container>
  );
};

export default LoadingMessages;
