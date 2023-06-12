import Editor, { FinalPost } from '@/components/editor';
import AdminLayout from '@/components/layout/AdminLayout';
import Post from '@/models/Posts';
import { generateFormData } from '@/utils/helper';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { FC } from 'react';
import { useState } from "react";
import dbConnect from '@/lib/dbConnect';


interface PostResponse extends FinalPost {
    id: string;
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Update: NextPage<Props> = ({ post }) => {
    const [updating, setUpdating] = useState(false);
    const handleSubmit = async (post: FinalPost) => {
        setUpdating(true);
        try {
            //first have to generate form data
            const formData = generateFormData(post)

            //submit post
            const { data } = await axios.patch('/api/posts/' + post.id, formData)
            console.log(data)
            //we don't want to define the type of error prematurely
        } catch (error: any) {
            console.log(error.response.data)
        }
        setUpdating(false);
    }


    return (
        <AdminLayout title="Update">
            <div className="max-w-4xl mx-auto">
                <Editor 
                initialValue={post} 
                onSubmit={handleSubmit} 
                busy={updating}
                btnTitle="Update" />


            </div>
        </AdminLayout>
    )
};


interface ServerSideResponse {
    post: PostResponse
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async (context) => {
    try {
        const slug = context.query.slug as string

        await dbConnect();

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
    } catch (error) {
        return { notFound: true }
    }
}

export default Update;