import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'fill' | 'line';
}

const XIcon: React.FC<SvgComponentProps> = ({ variant = 'fill', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 16}
      height={props.height || 16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <g
        clipPath="url(#clip0_120_4226)"
        stroke={variant === 'fill' ? '#fff' : '#1D9BF0'}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M2.667 2.667l7.822 10.666h2.844L5.511 2.666H2.666z"
          fill={variant === 'fill' ? '#fff' : '#1D9BF0'}
        />
        <path d="M2.667 13.333l4.511-4.512m1.64-1.64l4.515-4.514" />
      </g>
      <defs>
        <clipPath id="clip0_120_4226">
          <path
            fill={variant === 'fill' ? '#fff' : '#1D9BF0'}
            d="M0 0H16V16H0z"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default XIcon;
