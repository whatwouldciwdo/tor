"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface RichTextEditorProps {
  content?: string | null;
  onChange: (content: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  label,
  required = false,
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="border rounded-lg overflow-hidden">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={content || ""}
          onEditorChange={(newValue) => onChange(newValue)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "table image | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            branding: false, 
            promotion: false, 
          }}
        />
      </div>
    </div>
  );
}
