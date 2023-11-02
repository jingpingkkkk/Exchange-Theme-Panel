import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function CustomEditor({ initialValue, onEditorStateChange }) {
  const [editorState, setEditorState] = useState();

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(initialValue);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, [initialValue]);

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    onEditorStateChange(newEditorState);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorStateChange}
      editorStyle={{ border: "1px solid #eaedf1" }}
    />
  );
}

export default CustomEditor;
