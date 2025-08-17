import { Empty, Skeleton } from 'antd';
import { useGallery } from './useGallery.ts';
import times from 'lodash/times';
import { ErrorMessage } from '../common/ErrorMessage.tsx';
import { WithSkeleton } from '../common/WithSkeleton.tsx';
import { ImageMetadata } from './ImageMetadata.tsx';
import { SnippetsView } from './SnippetsView.tsx';

export const Gallery = () => {
  const { isLoading, data, error, currentImage, rootRef, handleImageClick } = useGallery();
  if (error) {
    return <ErrorMessage message={error.message} className='mt-48' />;
  }

  if (!data?.length) {
    return <Empty description='No results' className='mx-auto mt-48' />;
  }

  return (
    <div className='flex h-full' ref={rootRef}>
      <div className='flex flex-col' style={{ width: 'calc(100vw - 650px)' }}>
        <div className='mt-8 flex-1 mx-auto'>
          <WithSkeleton
            isLoading={isLoading}
            skeleton={<Skeleton.Image active className='!w-[600px] !h-[600px] ' />}
          >
            <img
              className='h-[600px] mx-auto'
              src={currentImage!.image_url}
              alt={currentImage!.name}
            />
          </WithSkeleton>
        </div>
        <div className='flex overflow-x-auto px-4 pb-2'>
          <WithSkeleton isLoading={isLoading} skeleton={<SnippetsSkeleton />}>
            <SnippetsView
              data={data}
              currentImage={currentImage}
              handleImageClick={handleImageClick}
            />
          </WithSkeleton>
        </div>
      </div>
      <div className='w-[300px] bg-slate-100 p-2'>
        <WithSkeleton isLoading={isLoading} skeleton={<MetadataSkeleton />}>
          <ImageMetadata image={currentImage!} />
        </WithSkeleton>
      </div>
    </div>
  );
};

const SnippetsSkeleton = () => (
  <>
    {times(6).map((i: number) => (
      <Skeleton.Node active key={i} className='h-24 not-last:mr-2' />
    ))}
  </>
);

const MetadataSkeleton = () => (
  <>
    <Skeleton.Input className='!w-full mt-2 mb-6' active />
    {times(4).map((i: number) => (
      <Skeleton.Input key={i} className='!w-full mb-1' size='small' active />
    ))}
    <Skeleton.Node className='!w-full !h-96' active />
  </>
);
