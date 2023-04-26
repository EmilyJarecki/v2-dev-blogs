import { NextPage } from 'next';
import Editor from '@/components/editor';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AdminLayout from '@/components/layout/AdminLayout';

interface Props { }

const Create: NextPage<Props> = () => {

    return (
        <AdminLayout title="New Post">
            <div className="max-w-4xl mx-auto">
                <Editor
                    onSubmit={(post) => {
                        console.log(post)
                    }}
                />
            </div>
        </AdminLayout>

    )
};

export default Create;