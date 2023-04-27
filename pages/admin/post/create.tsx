import { NextPage } from 'next';
import Editor, { FinalPost } from '@/components/editor';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AdminLayout from '@/components/layout/AdminLayout';
import axios from 'axios';

interface Props { }

const Create: NextPage<Props> = () => {

    const handleSubmit = async (post: FinalPost) => {
        try {
            //first have to generate form data
            const formData = new FormData()
            for (let key in post) {
                const value = (post as any)[key]
                if (key === 'tags') {
                    const tags = value.split(', ').map((tag: string) => tag.trim())
                    formData.append('tags', JSON.stringify(tags))

                } else formData.append(key, value)
            }
            //submit post
            const { data } = await axios.post('/api/posts', formData)
            console.log(data)
            //we don't want to define the type of error prematurely
        } catch (error: any) {
            console.log(error.response.data)
        }

    }
    return (
        <AdminLayout title="New Post">
            <div className="max-w-4xl mx-auto">
                <Editor
                    onSubmit={handleSubmit}
                />
            </div>
        </AdminLayout>

    )
};

export default Create;