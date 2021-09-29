import React, {FC} from 'react';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';

export interface PostViewImportantProps {
  isImportant: boolean;
  expireTime: any;
}

const PostViewImportant: FC<PostViewImportantProps> = ({
  isImportant,
  expireTime,
}: PostViewImportantProps) => {
  if (!isImportant || !expireTime) {
    return null;
  }

  const now = new Date();
  const notExpired = now.getTime() < new Date(expireTime).getTime();

  return <ImportantStatus notExpired={notExpired} />;
};

export default PostViewImportant;
