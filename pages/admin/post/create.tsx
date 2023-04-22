import { NextPage } from 'next';
import Editor from '@/components/editor';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props { }

const Create: NextPage<Props> = () => {

    return (
        <div className="max-w-4xl mx-auto">
            <Editor />
        </div>
    )
};

export default Create;