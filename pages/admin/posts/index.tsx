import AdminLayout from '@/components/layout/AdminLayout';
import { NextPage } from 'next';
import { useState } from 'react';
import PostCard from '@/components/common/PostCard';
interface Props {}

const posts = [
  {
    title: "This is my new post for now.",
    slug: "this-is-my-new-post-for-now",
    meta: "This is my first post, and typesetting industry. Lorem Ipsum has been the industry's standard",
    tags: ["post"],
    thumbnail:
    "https://compote.slate.com/images/5294e6d0-53ed-4a4a-a350-7eaeab72ac93.jpeg?crop=1560%2C1040%2Cx0%2Cy0",
    createdAt: "Sunday June 11 2023"
  },
  {
    title: "This is my new second post for now.",
    slug: "this-is-my-second-new-post-for-now",
    meta: "This is my second post, and typesetting industry. Lorem Ipsum has been the industry's standard",
    tags: ["post"],
    thumbnail:
    "https://compote.slate.com/images/5294e6d0-53ed-4a4a-a350-7eaeab72ac93.jpeg?crop=1560%2C1040%2Cx0%2Cy0",
    createdAt: "Sunday June 11 2023"
  }
]

const Posts: NextPage<Props> = () => {
const [postsToRender, setPostsToRender] = useState(posts)

  return (
  
  <AdminLayout>
    <div className="max-w-4xl mx-auto p-3">
      <div className="grid grid-cols-3 gap-4">
        {postsToRender.map((post, index) => 
        (<PostCard key = {index} post={post}/>))}
      </div>
      hello
    </div>
  </AdminLayout>
    )
};

export default Posts;