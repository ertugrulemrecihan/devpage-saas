import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'fill' | 'line';
}

const YouTubeIcon: React.FC<SvgComponentProps> = ({
  variant = 'fill',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 16}
      height={props.height || 16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_120_3846)">
        <path
          d="M12 2a3.334 3.334 0 013.333 3.334v5.333A3.331 3.331 0 0112 14H4a3.334 3.334 0 01-3.333-3.333V5.334A3.333 3.333 0 014 2h8zM6 6v4a.667.667 0 001.01.572l3.332-2a.667.667 0 000-1.143l-3.333-2A.667.667 0 006 6z"
          fill={variant === 'fill' ? '#FFFFFF' : '#FC0B1C'}
        />
      </g>
      <defs>
        <clipPath id="clip0_120_3846">
          <path
            fill={variant === 'fill' ? '#FFFFFF' : '#FC0B1C'}
            d="M0 0H16V16H0z"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default YouTubeIcon;
