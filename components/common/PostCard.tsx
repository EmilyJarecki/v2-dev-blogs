import { FC } from 'react';
import { PostDetail } from '@/utils/types';
import { dividerClasses } from '@mui/material';
import Image from 'next/image';
import dateFormat from 'dateformat';

interface Props {
  post: PostDetail
}

const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text
  return text.substring(0, trimBy).trim() + "..."
}

const PostCard: FC<Props> = ({ post }): JSX.Element => {
  //destructuring content
  const { title, slug, meta, createdAt, tags, thumbnail } = post
  return <div className="rounded shadow-sm shadow-secondary-dark overflow-hidden bg-primary dark:bg-primary-dark transition flex flex-col h-full">
    {/* thumbnail */}
    <div className="aspect-video relative">
      {!thumbnail ? <div className="w-full h-full flex items-center justify-center text-secondary-dark opacity-50 font-semibold">No image</div>
        :
        //Image is a part of Next
        (<Image src={thumbnail} layout="fill" alt="Thumbnail" />)}
    </div>
    {/* post info */}
    <div className="p-2 flex-1 flex flex-col">
      <div className="flex items-center justify-between text-sm text-primary-dark dark:text-primary">
        <div className="flex item-center space-x-1">
          {tags.map((t, index) => (
            <span key={t + index}>#{t}</span>
          ))}
        </div>
        {/* installed a npm package, dateformat  */}
        <span>{dateFormat(createdAt, "d-mmm-yyyy")}</span>


      </div>
      <h1 className="font-semibold text-primary-dark dark:text-primary">{trimText(title, 50)}</h1>
      <p className="text-secondary-dark">{trimText(meta, 70)}</p>

      <div className="flex justify-end items-center h-8 mt-auto space-x-4 text-primary-dark dark:text-primary">
        <button className="hover:underline">Edit</button>
        <button className="hover:underline">Delete</button>
      </div>
    </div>
  </div>
};

export default PostCard;