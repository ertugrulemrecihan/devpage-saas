import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const DribbbleIcon: React.FC<SvgComponentProps> = (props) => {
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
        d="M5.83 2.304a.25.25 0 01.05-.45 6.496 6.496 0 015.542.622.25.25 0 01.062.367 9.583 9.583 0 01-2.618 2.313A10.59 10.59 0 005.83 2.304zm2.144 3.321a9.562 9.562 0 00-3.5-2.932.246.246 0 00-.25.02 6.526 6.526 0 00-2.397 3.25.25.25 0 00.188.323 9.438 9.438 0 005.959-.661zm6.487 1.668a6.488 6.488 0 00-1.824-3.843.25.25 0 00-.375.021 10.574 10.574 0 01-2.856 2.525c.343.594.627 1.22.847 1.869a10.477 10.477 0 013.934-.298.25.25 0 00.274-.272v-.002zM10.53 8.824a10.487 10.487 0 01.021 4.708.25.25 0 00.356.28 6.516 6.516 0 003.536-4.953.25.25 0 00-.218-.28 9.527 9.527 0 00-3.695.25v-.005zm-1.227-.653a9.485 9.485 0 00-.775-1.7A10.438 10.438 0 014 7.5c-.733 0-1.463-.076-2.18-.228a.25.25 0 00-.3.222 6.482 6.482 0 002.043 5.25.25.25 0 00.383-.057 10.563 10.563 0 015.356-4.514v-.002zM4.73 13.328a.25.25 0 00.095.343 6.492 6.492 0 004.303.73.245.245 0 00.19-.165c.323-.97.488-1.984.488-3.005 0-.704-.078-1.405-.233-2.092a9.559 9.559 0 00-4.843 4.19z"
        fill="#B8509A"
      />
    </svg>
  );
};

export default DribbbleIcon;
