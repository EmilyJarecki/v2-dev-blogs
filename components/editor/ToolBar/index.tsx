import { FC } from 'react';
import { Editor } from '@tiptap/react';
import DropdownOptions from '@/components/common/DropdownOptions';

interface Props {
    editor: Editor | null
}

const ToolBar: FC<Props> = ({editor}): JSX.Element | null => {
  if(!editor) return null;
    return (
    <div>
        <DropdownOptions options={[
            {label: "Paragraph", onClick: () =>{
                console.log("Paragraph clicked")
            }},
            {label: "Heading 1", onClick: () =>{
                console.log("h1 clicked")
            }},
            {label: "Heading 2", onClick: () =>{
                console.log("h2 clicked")
            }},
            {label: "Heading 3", onClick: () =>{
                console.log("h3 clicked")
            }}            
            ]}
            head={<p>Paragraph</p>}   
            />
    </div>
    )
};

export default ToolBar;