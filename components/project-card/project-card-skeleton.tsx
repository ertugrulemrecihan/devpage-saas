import { IconCategory, IconCoin, IconProgressCheck } from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProjectCardSkeleton = () => {
  return (
    <div className="max-w-[30.563rem] w-full flex items-center p-5 rounded-lg bg-white border border-[#E5E5E5] shadow-project-card gap-x-5 h-[9.125rem]">
      <div className="h-full flex justify-between">
        <div className="relative rounded-sm border-[1.56px] border-white overflow-hidden shadow-project-image w-[3.5rem] h-[3.5rem]">
          <Skeleton width="100%" height="100%" />
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-y-3">
        <span className="font-medium text-base">
          <Skeleton />
        </span>
        <p className="font-normal text-sm text-[#666]">
          <Skeleton count={2} />
        </p>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <Skeleton width={16} height={16} />
            <Skeleton width={50} />
          </div>
          <div className="flex items-center gap-x-1">
            <Skeleton width={16} height={16} />
            <Skeleton width={50} />
          </div>
        </div>
      </div>
      <div className="h-full">
        <div className="flex items-center gap-x-1">
          <Skeleton width={16} height={16} />
          <Skeleton width={50} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
