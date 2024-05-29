import * as React from 'react';

export default function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 5a1 1 0 112 0 1 1 0 01-2 0zm1 3a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z"
      />
    </svg>
  );
}
