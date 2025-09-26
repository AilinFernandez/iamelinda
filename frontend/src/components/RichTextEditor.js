import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = "Escribe tu contenido aquí..." }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image',
    'blockquote', 'code-block', 'color', 'background'
  ];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        // Por ahora, pedimos URL de imagen
        const imageUrl = prompt('Pega la URL de la imagen:');
        if (imageUrl) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      }
    };
  };

  const customToolbar = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', handleImageUpload);
    }
  };

  React.useEffect(() => {
    if (quillRef.current) {
      customToolbar();
    }
  }, []);

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="zeno-quill-editor"
      />
    </div>
  );
};

export default RichTextEditor;
