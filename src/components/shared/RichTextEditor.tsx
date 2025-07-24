
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type RichTextEditorProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Toolbar = ({ editor }: { editor: HTMLDivElement | null }) => {
  const handleFormat = (command: string) => {
    if (editor) {
      document.execCommand(command, false);
      editor.focus();
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-t-md border-b border-input bg-transparent p-1">
      <ToggleGroup type="multiple">
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat('bold');
          }}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat('italic');
          }}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat('underline');
          }}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, className, ...props }, fwdRef) => {
    const editorRef = React.useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useImperativeHandle(fwdRef, () => editorRef.current as HTMLDivElement);
    
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
      onChange(event.currentTarget.innerHTML);
    };
    
    const Cmp = isMounted ? 'div' : 'div';

    return (
      <div
        className={cn(
          'w-full rounded-md border border-input bg-background shadow-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        <Toolbar editor={editorRef.current} />
        <Cmp
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          className="min-h-[150px] w-full p-3 text-base placeholder:text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
          {...props}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
