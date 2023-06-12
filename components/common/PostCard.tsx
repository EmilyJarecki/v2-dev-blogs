import { FC } from 'react';
import { PostDetail } from '@/utils/types';


interface Props {
    post: PostDetail
}

const PostCard: FC<Props> = ({post}): JSX.Element => {
  return <div>{post.title}</div>;
};

export default PostCard;