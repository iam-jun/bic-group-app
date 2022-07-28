import React from 'react';
import TagComponent, { TagProps } from '~/beinComponents/Tag/TagComponent';

const Small: React.FC<TagProps> = (props: TagProps) => (
  <TagComponent variant="small" {...props} />
);

const Medium: React.FC<TagProps> = (props: TagProps) => (
  <TagComponent variant="medium" {...props} />
);

const Tag = Object.assign(
  TagComponent, { Small, Medium },
);

export default Tag;
