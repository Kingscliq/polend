interface BounceLoaderTypes {
  text?: string;
}

export const BounceLoader = ({ text }: BounceLoaderTypes) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center py-3">
        <span className="bg-white rounded-full animate-bounce w-2 h-2 block"></span>
        <span className="bg-white rounded-full animate-bounce-slow w-2 h-2 block mx-1"></span>
        <span className="bg-white rounded-full animate-bounce-slower w-2 h-2 block"></span>
      </div>

      {text && <span className="text-white text-sm"> {text}</span>}
    </div>
  );
};
