// import node module libraries
import React, { useEffect, useRef } from 'react';
import { useQuill } from 'react-quilljs';

const ReactQuillEditor = ({ initialValue, onChange }) => {
  const { quill, quillRef } = useQuill();
  const isInitialValueSet = useRef(false);

  useEffect(() => {
    if (quill && !isInitialValueSet.current) {
      quill.clipboard.dangerouslyPasteHTML(initialValue);
      quill.on('text-change', () => {
        onChange(quill.root.innerHTML); // Call the parent callback with the new value
      });
      isInitialValueSet.current = true;
    }
  }, [quill, initialValue]);

  return (
    <div style={{ width: 'auto', height: 'auto' }}>
      <div ref={quillRef}/>
    </div>
  )
};

export default ReactQuillEditor;
