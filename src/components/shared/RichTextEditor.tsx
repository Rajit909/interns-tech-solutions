
'use client';

import ReactQuill, { type ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { forwardRef } from 'react';

interface RichTextEditorProps extends ReactQuillProps {
  readOnly?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link'
];

// Using forwardRef to solve the findDOMNode issue with React 18 Strict Mode
const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>((props, ref) => {
  return (
    <div className="bg-background rounded-md border border-input">
      <ReactQuill
        ref={ref}
        theme="snow"
        modules={modules}
        formats={formats}
        className='[&_.ql-editor]:min-h-[250px]'
        {...props}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
