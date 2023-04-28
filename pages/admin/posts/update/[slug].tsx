import Editor, { FinalPost } from '@/components/editor';
import AdminLayout from '@/components/layout/AdminLayout';
import Post from '@/models/Posts';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { FC } from 'react';

interface PostResponse extends FinalPost {
    id: string;
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Update: NextPage<Props> = ({post}) => {
    return (
    <AdminLayout title="Update">
        <div className="max-w-4xl mx-auto">
        <Editor initialValue={post} onSubmit={()=>{}} btnTitle="Update"/>


        </div>
    </AdminLayout>
    )
};


interface ServerSideResponse {
    post: PostResponse
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async (context) => {
    const slug = context.query.slug as string

    const post = await Post.findOne({ slug })
    if (!post) return { notFound: true }

    const { _id, meta, title, content, thumbnail, tags } = post

    return {
        props: {
            post: {
                id: _id.toString(),
                title, 
                content, 
                tags: tags.join(", "), 
                thumbnail: thumbnail?.url || "",
                slug,
                meta
            }
        }
    }
}

export default Update;