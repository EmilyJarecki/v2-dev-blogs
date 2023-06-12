import { FC, useEffect, useState, ChangeEventHandler } from 'react';
import { useEditor, EditorContent, getMarkRange, Range, getMarksBetween } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import EditLink from './Link/EditLink';
import GalleryModal, { ImageSelectionResult } from './GalleryModal';
import TipTapImage from "@tiptap/extension-image"
import axios from 'axios';
import SeoForm, { SeoResult } from './SeoForm';
import ActionButton from '../common/ActionButton';
import ThumbnailSelector from './ThumbnailSelector';

export interface FinalPost extends SeoResult{
    //optional id because when we create a post, it's not going to have an id yet
    id?: string;
    title: string;
    content: string;
    thumbnail?: File | string;
}

interface Props { 
    initialValue?: FinalPost;
    btnTitle?: string;
    busy?: boolean;
    onSubmit(post: FinalPost):void
}

const Editor: FC<Props> = ({
    initialValue, 
    //default value
    btnTitle = "Submit", 
    //default value
    busy = false, 
    onSubmit
}): JSX.Element => {
    const [selectionRange, setSelectionRange] = useState<Range>()
    const [showGallery, setShowGallery] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<{ src: string }[]>([])
    const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>()
    const [post, setPost] = useState<FinalPost>({
        title: "",
        content: "",
        meta: "",
        tags: "",
        slug: "",
    })



    const fetchImages = async () => {
        const { data } = await axios("/api/image")
        setImages(data.images)
    }
    const handleImageUpload = async (image: File) => {
        setUploading(true)
        const formData = new FormData()
        //this name matters- it's the same one as in index.ts
        formData.append("image", image)
        const { data } = await axios.post('/api/image', formData)
        setUploading(false)
        setImages([data, ...images])

        console.log(data)
    }


    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                autolink: false,
                linkOnPaste: false,
                openOnClick: false,
                HTMLAttributes: { target: '' }
            }),
            Placeholder.configure({
                placeholder: 'Type something',
            }),
            Youtube.configure({
                //size which which will appear onscreen
                width: 840,
                height: 472.5,
                HTMLAttributes: {
                    class: "mx-auto rounded"
                }
            }),
            TipTapImage.configure({
                HTMLAttributes: {
                    class: 'mx-auto'
                }
            })

        ],
        editorProps: {
            handleClick(view, pos, event) {
                const { state } = view
                const selectionRange = getMarkRange(
                    state.doc.resolve(pos),
                    state.schema.marks.link)
                if (selectionRange) setSelectionRange(selectionRange)
            },
            attributes: {
                class: 'prose-lg prose focus:outline-none dark:prose-invert max-w-full mx-auto h-full'
            }
        }
    });

    const handleImageSelection = (result: ImageSelectionResult) => {
        editor
            ?.chain()
            .focus()
            .setImage({ src: result.src, alt: result.altText })
            .run();
    }

    const handleSubmit = () =>{
        if(!editor) return
        onSubmit({...post, content: editor.getHTML() })
    }

    const updateTitle: ChangeEventHandler<HTMLInputElement>=({target})=>{
        setPost({...post, title: target.value})
    }
    const updateSeoValue =(result: SeoResult)=>{
        setPost({...post, ...result})
    }
    const updateThumbnail =(file: File)=>{
        setPost({...post, thumbnail: file})
    }


    useEffect(() => {
        if (editor && selectionRange) {
            editor.commands.setTextSelection(selectionRange)
        }
    }, [editor, selectionRange])

    useEffect(() => {
        fetchImages()
    }, [])

    useEffect(() => {
        if(initialValue){
            setPost({...initialValue})
            editor?.commands.setContent(initialValue.content)
            const {meta, slug, tags} = initialValue;
            setSeoInitialValue({meta, slug, tags})
        }
    }, [initialValue, editor])

    return (
        <>
            <div className="p-3 dark:bg-primary-dark bg-primary transition">
                <div className="sticky top-0 z-10 dark:bg-primary-dark bg-primary">
                    {/* THUMBNAIL SELECTOR AND SUBMIT BUTTON */}
                    <div className="flex items-center justify-between mb-3">
                        <ThumbnailSelector 
                        initialValue={post.thumbnail as string} 
                        onChange={updateThumbnail} />
                        <div className="inline-block">
                            <ActionButton 
                            busy={busy} 
                            title={btnTitle} 
                            onClick={handleSubmit} 
                            disabled={busy}/>
                        </div>
                    </div>


                    {/* TITLE INPUT */}
                    <input
                        type="text"
                        className="py-2 outline-none bg-transparent w-full border-0 border-b-[1px] border-secondary-dark dark:border-secondary-light text-3xl font-semibold italic text-primary-dark dark:text-primary-light mb-3"
                        placeholder="Title" 
                        onChange={updateTitle}
                        value={post.title}
                        />

                    <ToolBar 
                    editor={editor} 
                    onOpenImageClick={() => setShowGallery(true)} />
                    <div className="h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3" />
                </div>



                {editor ? <EditLink editor={editor} /> : null}
                <EditorContent editor={editor} className="min-h-[300px]" />
                <div className="h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3" />
                <SeoForm 
                onChange={updateSeoValue}
                title={post.title}
                initialValue={seoInitialValue}
                />
            </div>
            <GalleryModal
                visible={showGallery}
                onClose={() => setShowGallery(false)}
                onSelect={handleImageSelection}
                images={images}
                onFileSelect={handleImageUpload}
                uploading={uploading}
            />
        </>

    )
};

export default Editor;