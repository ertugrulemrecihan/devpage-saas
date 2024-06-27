import { useLayoutEffect, useState } from 'react';

interface ProfileBackgroundProps {
  backgroundColor: string;
  borderColors: {
    from: string;
    to: string;
  };
}

export const ProfileBackground = ({
  backgroundColor,
  borderColors,
}: ProfileBackgroundProps) => {
  const [maxTriangleQuantity, setMaxTriangleQuantity] = useState(0);

  useLayoutEffect(() => {
    const windowWidth = window.innerWidth;
    console.log(windowWidth);

    const triangleWidth = windowWidth > 1024 ? 508 : 100;

    const maxTriangleQuantity = Math.floor(windowWidth / triangleWidth) * 16;

    setMaxTriangleQuantity(maxTriangleQuantity);
  }, []);

  return (
    <div className="w-full h-[11.313rem] overflow-hidden relative">
      <div className="absolute w-full flex items-center justify-center left-0 top-[5.25rem] z-10">
        <div className="w-full flex items-start justify-center blur-[60px] -space-x-[383px]">
          {Array.from({ length: maxTriangleQuantity }).map((_, index) => (
            <Triangle key={index} color={backgroundColor} />
          ))}
        </div>
      </div>
      <div
        className="absolute bottom-0 z-20 w-full h-[1px]"
        style={{
          background: `linear-gradient(90deg, ${borderColors.from}, ${borderColors.to})`,
        }}
      ></div>
    </div>
  );
};

const Triangle = ({ color }: { color: string }) => {
  return (
    <div className="w-[31.75rem] h-[42.125rem]">
      <div
        style={{
          borderBottomColor: color,
        }}
        className="w-0 h-0 border-l-[13.748rem] border-l-transparent border-r-[13.748rem] border-r-transparent border-b-[31.594rem]"
      ></div>
    </div>
  );
};
