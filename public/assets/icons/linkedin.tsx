import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'fill' | 'line';
}

const LinkedInIcon: React.FC<SvgComponentProps> = ({
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
      <path
        d="M4.627 3.333a1.333 1.333 0 11-2.667-.001 1.333 1.333 0 012.667.001zm.04 2.32H2V14h2.667V5.653zm4.213 0H6.227V14h2.627V9.62c0-2.44 3.18-2.667 3.18 0V14h2.633V8.713c0-4.113-4.707-3.96-5.813-1.94l.026-1.12z"
        fill={variant === 'fill' ? '#FFFFFF' : '#006699'}
      />
    </svg>
  );
};

export default LinkedInIcon;
