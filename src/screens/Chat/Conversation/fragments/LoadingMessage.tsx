import React from 'react';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {generateUniqueId, getRandomInt} from '~/utils/generator';

const LoadingMessage = () => {
  const count = getRandomInt(1, 3); // lines count

  return (
    <Placeholder
      key={`loading-message-${generateUniqueId()}`}
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
  );
};

export default LoadingMessage;
