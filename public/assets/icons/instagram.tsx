import * as React from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const InstagramIcon: React.FC<SvgComponentProps> = (props) => {
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
        d="M8.685 1.334c.75.001 1.13.005 1.46.015l.129.004c.15.005.297.012.475.02.709.033 1.193.145 1.618.31.44.17.81.399 1.18.77.37.37.6.742.77 1.18.164.425.277.91.31 1.619l.02.474.004.13c.01.328.014.708.015 1.459v1.37c0 .75-.005 1.13-.015 1.46l-.004.129c-.005.15-.012.296-.02.474-.033.71-.146 1.194-.31 1.619-.17.44-.4.81-.77 1.18-.37.37-.742.6-1.18.77-.425.164-.91.276-1.619.31l-.474.02-.13.003c-.328.01-.708.015-1.459.016h-1.37c-.75-.001-1.13-.005-1.459-.015l-.13-.004c-.149-.005-.296-.012-.474-.02-.71-.033-1.193-.146-1.618-.31a3.26 3.26 0 01-1.182-.77 3.269 3.269 0 01-.768-1.18c-.165-.425-.277-.91-.31-1.619a49.639 49.639 0 01-.02-.474l-.004-.13c-.01-.328-.014-.709-.016-1.459v-1.37c.001-.75.005-1.13.015-1.46l.004-.129.02-.474c.033-.71.146-1.194.31-1.619.17-.439.399-.81.77-1.18.37-.371.742-.6 1.18-.77.426-.165.909-.276 1.619-.31l.475-.02.129-.004c.328-.01.709-.014 1.459-.015h1.37zM8 4.667a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zM8 6a2 2 0 110 4 2 2 0 010-4zm3.5-2.333a.834.834 0 10.001 1.667.834.834 0 000-1.667z"
        fill="#fff"
      />
    </svg>
  );
};

export default InstagramIcon;
