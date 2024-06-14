import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const MailIcon: React.FC<SvgComponentProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 16}
      height={props.height || 16}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <g
        clipPath="url(#clip0_185_219)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M2.25 5.25a1.5 1.5 0 011.5-1.5h10.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-7.5z"
          stroke="#2E2E2E"
        />
        <path d="M2.25 5.25L9 9.75l6.75-4.5" stroke="#000" />
      </g>
      <defs>
        <clipPath id="clip0_185_219">
          <path fill="#fff" d="M0 0H18V18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MailIcon;
