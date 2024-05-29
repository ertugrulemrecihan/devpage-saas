import * as React from 'react';

export default function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#clip0_339_3869)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.604 3.598c.355-1.464 2.437-1.464 2.792 0a1.437 1.437 0 002.144.888c1.286-.783 2.758.688 1.975 1.975a1.436 1.436 0 00.887 2.143c1.464.355 1.464 2.437 0 2.792a1.437 1.437 0 00-.888 2.144c.784 1.286-.688 2.758-1.975 1.975a1.436 1.436 0 00-2.143.887c-.355 1.464-2.437 1.464-2.792 0a1.437 1.437 0 00-2.144-.888c-1.286.784-2.758-.688-1.975-1.975a1.437 1.437 0 00-.888-2.143c-1.463-.355-1.463-2.437 0-2.792a1.437 1.437 0 00.889-2.144c-.783-1.286.688-2.758 1.975-1.975a1.435 1.435 0 002.143-.888z" />
        <path d="M7.5 10a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" />
      </g>
      <defs>
        <clipPath id="clip0_339_3869">
          <path fill="#fff" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
