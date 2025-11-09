
import * as React from 'react';
import {cn} from '@/lib/utils';

const Bot = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({className, ...props}, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('h-6 w-6', className)}
      ref={ref}
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <circle
        cx="128"
        cy="128"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M208,128a80.1,80.1,0,0,1-23.4,56.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M48,128a80.1,80.1,0,0,0,23.4,56.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M184.6,71.4A80.1,80.1,0,0,0,128,48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M71.4,71.4A80.1,80.1,0,0,1,128,48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
);
Bot.displayName = 'Bot';

export {Bot};
