import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function CustomEditor({ initialValue, onEditorStateChange }) {
    const blocksFromHTML = convertFromHTML(initialValue);
    const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(contentState)
    );

    const handleEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        onEditorStateChange(newEditorState);
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
            />
        </div>
    );
}

export default CustomEditor;
