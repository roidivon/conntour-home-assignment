import type { useGallery } from './useGallery.ts';
import type { ImageData } from '../../types.ts';
import classNames from 'classnames';

export const SnippetsView = ({
  data,
  currentImage,
  handleImageClick,
}: Pick<ReturnType<typeof useGallery>, 'data' | 'handleImageClick' | 'currentImage'>) => (
  <>
    {data!.map((image, i) => (
      <ImageSnippet
        key={image.id}
        image={image}
        isActive={image === currentImage}
        onClick={() => handleImageClick(i)}
      />
    ))}
  </>
);

const ImageSnippet = ({
  image,
  isActive,
  onClick,
}: {
  image: ImageData;
  isActive: boolean;
  onClick: () => void;
}) => (
  <img
    id={String(image.id)}
    key={image.id}
    onClick={onClick}
    src={image.image_url}
    alt={image.name}
    className={classNames(
      'cursor-pointer h-24 not-last:mr-2 p-3 hover:bg-slate-300 rounded-sm transition-all ease-in-out duration-200',
      {
        'bg-slate-300': isActive,
      },
    )}
  />
);
