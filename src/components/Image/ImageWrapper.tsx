import React, { Component, ReactNode } from 'react';
import Image, { ImageProps } from '.';

// eslint-disable-next-line react/prefer-stateless-function
class ImageWrapper extends Component<ImageProps> {
  render(): ReactNode {
    return <Image {...this.props} />;
  }
}

export default ImageWrapper;
