import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const RefreshIcon: React.FC<SvgComponentProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 18}
      height={props.height || 18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <g
        clipPath="url(#clip0_590_4403)"
        stroke="#666"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 8.25a6.075 6.075 0 00-11.625-1.5M3 3.75v3h3M3 9.75a6.075 6.075 0 0011.625 1.5m.375 3v-3h-3" />
      </g>
      <defs>
        <clipPath id="clip0_590_4403">
          <path fill="#fff" d="M0 0H18V18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RefreshIcon;
