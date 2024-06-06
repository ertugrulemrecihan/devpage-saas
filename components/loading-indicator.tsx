import { BeatLoader } from 'react-spinners';

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <BeatLoader color="#3B82F6" />
    </div>
  );
};

export default LoadingIndicator;
