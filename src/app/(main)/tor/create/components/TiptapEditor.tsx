"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import OrderedList from "@tiptap/extension-ordered-list";
import { Plugin, PluginKey } from 'prosemirror-state';
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListTodo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Undo,
  Redo,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

interface TiptapEditorProps {
  content?: string;  // Made optional to accept undefined from form data
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

// ✅ Custom Image extension with base64 paste/drop support AND interactive resize handles
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {}; 
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.className = 'image-resize-container';
      container.style.cssText = 'position: relative; display: inline-block; max-width: 100%;';
      container.setAttribute('draggable', 'true'); // ✅ Enable drag and drop
      
      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      
      // Set initial dimensions
      if (node.attrs.width) {
        img.style.width = typeof node.attrs.width === 'number' ? `${node.attrs.width}px` : node.attrs.width;
      }
      if (node.attrs.height) {
        img.style.height = typeof node.attrs.height === 'number' ? `${node.attrs.height}px` : node.attrs.height;
      }
      
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.cursor = 'pointer';
      img.style.borderRadius = '4px';
      
      container.appendChild(img);
      
      // Add resize handle
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'image-resize-handle';
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: nwse-resize;
        opacity: 0;
        transition: opacity 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      `;
      container.appendChild(resizeHandle);
      
      // Show/hide resize handle on hover
      container.addEventListener('mouseenter', () => {
        if (!editor.isEditable) return;
        resizeHandle.style.opacity = '1';
      });
      
      container.addEventListener('mouseleave', () => {
        resizeHandle.style.opacity = '0';
      });
      
      // Resize functionality
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;
      
      resizeHandle.addEventListener('mousedown', (e) => {
        if (!editor.isEditable) return;
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        startX = e.clientX;
        startWidth = img.offsetWidth;
        
        resizeHandle.style.opacity = '1';
        
        const onMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          
          const deltaX = e.clientX - startX;
          const newWidth = Math.max(100, Math.min(startWidth + deltaX, container.parentElement?.offsetWidth || 1000));
          
          img.style.width = `${newWidth}px`;
        };
        
        const onMouseUp = () => {
          if (!isResizing) return;
          isResizing = false;
          
          // Update node attributes
          const newWidth = img.offsetWidth;
          const pos = getPos();
          if (typeof pos === 'number') {
            editor.commands.updateAttributes('image', {
              width: `${newWidth}px`,
            });
          }
          
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      
      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') return false;
          
          img.src = updatedNode.attrs.src;
          if (updatedNode.attrs.width) {
            img.style.width = typeof updatedNode.attrs.width === 'number' ? `${updatedNode.attrs.width}px` : updatedNode.attrs.width;
          }
          if (updatedNode.attrs.height) {
            img.style.height = typeof updatedNode.attrs.height === 'number' ? `${updatedNode.attrs.height}px` : updatedNode.attrs.height;
          }
          
          return true;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageHandler'),
        props: {
          // Handle paste events
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items || []);
            
            for (const item of items) {
              if (item.type.indexOf('image') === 0) {
                event.preventDefault();
                
                const file = item.getAsFile();
                if (!file) continue;

                const reader = new FileReader();
                
                reader.onload = (readerEvent) => {
                  const base64 = readerEvent.target?.result as string;
                  
                  // Insert image with base64 data and default size
                  const node = view.state.schema.nodes.image.create({
                    src: base64,
                    alt: file.name,
                    width: '600px', // Default width
                  });
                  
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                  
                  console.log('✅ Image pasted as base64:', file.name, base64.substring(0, 50) + '...');
                };
                
                reader.readAsDataURL(file);
                return true;
              }
            }
            
            return false;
          },
          
          // Handle drop events
          handleDrop(view, event, slice, moved) {
            if (!moved && event.dataTransfer?.files?.length) {
              event.preventDefault();
              
              const files = Array.from(event.dataTransfer.files);
              const imageFiles = files.filter(file => file.type.startsWith('image/'));
              
              if (imageFiles.length === 0) return false;
              
              imageFiles.forEach(file => {
                const reader = new FileReader();
                
                reader.onload = (readerEvent) => {
                  const base64 = readerEvent.target?.result as string;
                  
                  const node = view.state.schema.nodes.image.create({
                    src: base64,
                    alt: file.name,
                    width: '600px', // Default width
                  });
                  
                  const pos = view.posAtCoords({ 
                    left: event.clientX, 
                    top: event.clientY 
                  });
                  
                  if (pos) {
                    const transaction = view.state.tr.insert(pos.pos, node);
                    view.dispatch(transaction);
                    
                    console.log('✅ Image dropped as base64:', file.name, base64.substring(0, 50) + '...');
                  }
                };
                
                reader.readAsDataURL(file);
              });
              
              return true;
            }
            
            return false;
          },
        },
      }),
    ];
  },
});

// Custom OrderedList extension with listStyleType support
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'decimal',
        parseHTML: (element) => {
          return element.getAttribute('data-list-style') || 
                 element.style.listStyleType || 
                 'decimal';
        },
        renderHTML: (attributes) => {
          if (!attributes.listStyleType || attributes.listStyleType === 'decimal') {
            return {};
          }
          return {
            'data-list-style': attributes.listStyleType,
            style: `list-style-type: ${attributes.listStyleType}`,
            class: `list-style-${attributes.listStyleType}`,
          };
        },
      },
    };
  },
});

const MenuBar = ({ editor }: any) => {
  const [showListStyleDropdown, setShowListStyleDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!editor) {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowListStyleDropdown(false);
      }
    };

    if (showListStyleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showListStyleDropdown]);

  // ✅ NEW: Upload image and convert to base64
  const addImage = useCallback(() => {
    // Trigger file input
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      
      // Insert image at cursor
      editor.chain().focus().setImage({ 
        src: base64, 
        alt: file.name 
      }).run();
      
      console.log('✅ Image uploaded as base64:', file.name);
    };
    
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Set list style type using Tiptap commands
  const setListStyle = (style: string) => {
    // Ensure we have an ordered list
    if (!editor.isActive('orderedList')) {
      editor.chain().focus().toggleOrderedList().run();
    }
    
    // Use Tiptap command to update attributes
    editor.chain().focus().updateAttributes('orderedList', {
      listStyleType: style
    }).run();
    
    console.log('✅ Applied list style via Tiptap:', style);
    setShowListStyleDropdown(false);
  };

  // Helper function for button classes
  const getButtonClass = (isActive: boolean = false) => {
    return `p-2 rounded hover:bg-blue-100 hover:border-blue-300 transition-colors border ${
      isActive 
        ? "bg-blue-200 border-blue-400 text-blue-900" 
        : "bg-white border-gray-300 text-gray-700"
    } disabled:opacity-30 disabled:cursor-not-allowed`;
  };

  return (
    <div className="border-b-2 border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100 p-3 flex flex-wrap gap-2 items-center shadow-sm">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {/* Text Formatting */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive("bold"))}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive("italic"))}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClass(editor.isActive("underline"))}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={getButtonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getButtonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={getButtonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={getButtonClass(editor.isActive("paragraph"))}
          title="Paragraph"
        >
          <Pilcrow size={18} />
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300 relative">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        
        {/* Ordered List with Dropdown */}
        <div ref={dropdownRef} className="flex items-center gap-0 relative">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${getButtonClass(editor.isActive("orderedList"))} rounded-r-none border-r-0`}
            title="Numbered List (1, 2, 3)"
          >
            <ListOrdered size={18} />
          </button>
          <button
            type="button"
            onClick={() => setShowListStyleDropdown(!showListStyleDropdown)}
            className={`${getButtonClass(editor.isActive("orderedList"))} rounded-l-none px-1`}
            title="List Style Options"
          >
            <ChevronDown size={14} />
          </button>
          
          {/* Dropdown Menu */}
          {showListStyleDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[180px]">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setListStyle('decimal')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-900"
                >
                  <span className="font-mono text-gray-900">1, 2, 3</span>
                  <span className="text-gray-700">Numbered</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListStyle('lower-alpha')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-900"
                >
                  <span className="font-mono text-gray-900">a, b, c</span>
                  <span className="text-gray-700">Lowercase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListStyle('upper-alpha')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-900"
                >
                  <span className="font-mono text-gray-900">A, B, C</span>
                  <span className="text-gray-700">Uppercase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListStyle('lower-roman')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-900"
                >
                  <span className="font-mono text-gray-900">i, ii, iii</span>
                  <span className="text-gray-700">Roman Lower</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListStyle('upper-roman')}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-900"
                >
                  <span className="font-mono text-gray-900">I, II, III</span>
                  <span className="text-gray-700">Roman Upper</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={getButtonClass(editor.isActive("taskList"))}
          title="Task List (Checklist)"
        >
          <ListTodo size={18} />
        </button>

        {/* Indent/Outdent */}
        {(editor.isActive("bulletList") ||
          editor.isActive("orderedList") ||
          editor.isActive("taskList")) && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
              disabled={!editor.can().sinkListItem("listItem")}
              className={getButtonClass()}
              title="Indent (Tab)"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().liftListItem("listItem").run()}
              disabled={!editor.can().liftListItem("listItem")}
              className={getButtonClass()}
              title="Outdent (Shift+Tab)"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Alignment */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={getButtonClass(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={getButtonClass(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={getButtonClass(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={getButtonClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify size={18} />
        </button>
      </div>

      {/* Link & Image */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300">
        <button
          type="button"
          onClick={setLink}
          className={getButtonClass(editor.isActive("link"))}
          title="Insert Link"
        >
          <LinkIcon size={18} />
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-red-100 border border-red-300 bg-white text-red-600 transition-colors"
            title="Remove Link"
          >
            <Unlink size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={addImage}
          className={getButtonClass()}
          title="Insert Image (Upload or Paste)"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="flex gap-1 pr-3 border-r-2 border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={getButtonClass()}
          title="Insert Table (3x3)"
        >
          <TableIcon size={18} />
        </button>
        {editor.isActive("table") && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className={getButtonClass()}
              title="Add Column Before"
            >
              <Plus size={14} />
              <span className="text-xs ml-0.5">Col←</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className={getButtonClass()}
              title="Add Column After"
            >
              <Plus size={14} />
              <span className="text-xs ml-0.5">Col→</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="p-2 rounded hover:bg-red-100 border border-red-300 bg-white text-red-600 transition-colors text-xs"
              title="Delete Column"
            >
              <Minus size={14} />
              <span className="ml-0.5">Col</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className={getButtonClass()}
              title="Add Row Before"
            >
              <Plus size={14} />
              <span className="text-xs ml-0.5">Row↑</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className={getButtonClass()}
              title="Add Row After"
            >
              <Plus size={14} />
              <span className="text-xs ml-0.5">Row↓</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="p-2 rounded hover:bg-red-100 border border-red-300 bg-white text-red-600 transition-colors text-xs"
              title="Delete Row"
            >
              <Minus size={14} />
              <span className="ml-0.5">Row</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className={getButtonClass()}
              title="Toggle Header Row"
            >
              <span className="text-xs font-semibold">Hdr</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-2 rounded hover:bg-red-100 border border-red-300 bg-white text-red-600 transition-colors"
              title="Delete Table"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={getButtonClass()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={getButtonClass()}
          title="Redo (Ctrl+Y)"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  label,
  required = false,
  readOnly = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration error
    editable: !readOnly, // Control editability
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        orderedList: false, // Disable default orderedList to use custom one
      }),
      CustomOrderedList,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer hover:text-blue-800",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-0 list-none",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start gap-2",
        },
        nested: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-400 w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-gray-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-400 bg-gray-100 font-bold p-2 text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-400 p-2",
        },
      }),
      // ✅ Use CustomImage instead of default Image
      CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded my-2",
          // ✅ Enable resize handles
          style: "cursor: pointer; max-width: 100%;",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      // ✅ CRITICAL FIX: Always call onChange, regardless of readOnly
      const html = editor.getHTML();
      console.log('🔄 Editor updated, HTML length:', html.length);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          `prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4 text-gray-900 ${
            readOnly ? "bg-gray-50 cursor-default" : ""
          }`,
      },
    },
  });

  // Update editor's editable state when readOnly prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Sync content when prop changes (e.g. after data fetch)
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      console.log('📥 Setting content from props, length:', content.length);
      editor.commands.setContent(content);
    }
  }, [editor, content]);


  return (
    <>
      {/* Global CSS for list styles */}
      <style jsx global>{`
        /* Disable Tailwind Prose counter and enable native list-style-type */
        .prose .ProseMirror ol.list-style-decimal,
        .prose .ProseMirror ol.list-style-lower-alpha,
        .prose .ProseMirror ol.list-style-upper-alpha,
        .prose .ProseMirror ol.list-style-lower-roman,
        .prose .ProseMirror ol.list-style-upper-roman,
        .ProseMirror ol.list-style-decimal,
        .ProseMirror ol.list-style-lower-alpha,
        .ProseMirror ol.list-style-upper-alpha,
        .ProseMirror ol.list-style-lower-roman,
        .ProseMirror ol.list-style-upper-roman {
          list-style-position: outside !important;
          counter-reset: none !important;
          padding-left: 1.5em !important;
          margin-left: 1em !important;
        }
        
        .prose .ProseMirror ol.list-style-decimal li,
        .prose .ProseMirror ol.list-style-lower-alpha li,
        .prose .ProseMirror ol.list-style-upper-alpha li,
        .prose .ProseMirror ol.list-style-lower-roman li,
        .prose .ProseMirror ol.list-style-upper-roman li,
        .ProseMirror ol.list-style-decimal li,
        .ProseMirror ol.list-style-lower-alpha li,
        .ProseMirror ol.list-style-upper-alpha li,
        .ProseMirror ol.list-style-lower-roman li,
        .ProseMirror ol.list-style-upper-roman li {
          counter-increment: none !important;
          padding-left: 0.5em !important;
          display: list-item !important;
          margin-bottom: 0.5em !important;
        }
        
        .prose .ProseMirror ol.list-style-decimal li p,
        .prose .ProseMirror ol.list-style-lower-alpha li p,
        .prose .ProseMirror ol.list-style-upper-alpha li p,
        .prose .ProseMirror ol.list-style-lower-roman li p,
        .prose .ProseMirror ol.list-style-upper-roman li p,
        .ProseMirror ol.list-style-decimal li p,
        .ProseMirror ol.list-style-lower-alpha li p,
        .ProseMirror ol.list-style-upper-alpha li p,
        .ProseMirror ol.list-style-lower-roman li p,
        .ProseMirror ol.list-style-upper-roman li p {
          display: inline-block !important;
          margin: 0 !important;
          vertical-align: top !important;
        }
        
        .prose .ProseMirror ol.list-style-decimal li::before,
        .prose .ProseMirror ol.list-style-lower-alpha li::before,
        .prose .ProseMirror ol.list-style-upper-alpha li::before,
        .prose .ProseMirror ol.list-style-lower-roman li::before,
        .prose .ProseMirror ol.list-style-upper-roman li::before,
        .ProseMirror ol.list-style-decimal li::before,
        .ProseMirror ol.list-style-lower-alpha li::before,
        .ProseMirror ol.list-style-upper-alpha li::before,
        .ProseMirror ol.list-style-lower-roman li::before,
        .ProseMirror ol.list-style-upper-roman li::before {
          content: none !important;
          display: none !important;
        }
        
        /* List style types */
        .prose .ProseMirror ol.list-style-decimal,
        .ProseMirror ol.list-style-decimal {
          list-style-type: decimal !important;
        }
        
        .prose .ProseMirror ol.list-style-lower-alpha,
        .ProseMirror ol.list-style-lower-alpha {
          list-style-type: lower-alpha !important;
        }
        
        .prose .ProseMirror ol.list-style-upper-alpha,
        .ProseMirror ol.list-style-upper-alpha {
          list-style-type: upper-alpha !important;
        }
        
        .prose .ProseMirror ol.list-style-lower-roman,
        .ProseMirror ol.list-style-lower-roman {
          list-style-type: lower-roman !important;
        }
        
        .prose .ProseMirror ol.list-style-upper-roman,
        .ProseMirror ol.list-style-upper-roman {
          list-style-type: upper-roman !important;
        }
        
        /* ✅ Image resize styling */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
          transition: outline 0.2s;
        }
        
        .ProseMirror img:hover {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Image selected state - show resize hint */
        .ProseMirror-selectednode::after {
          content: '⇔ Drag corner to resize';
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
      
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className={`border rounded-lg overflow-hidden shadow-sm ${
          readOnly ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-white"
        }`}>
          {!readOnly && <MenuBar editor={editor} />}
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}