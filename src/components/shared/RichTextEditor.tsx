
'use client';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
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

export default function RichTextEditor({ value, onChange, readOnly }: RichTextEditorProps) {
  return (
    <div className="bg-background rounded-md border border-input">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        className='[&_.ql-editor]:min-h-[250px]'
      />
    </div>
  );
}
