import type { ImageData } from '../../types.ts';
import dayjs from 'dayjs';

export const ImageMetadata = ({ image }: { image: ImageData }) => (
  <div className='mt-2 pr-3 mr-[-4px] overflow-y-auto' style={{ height: 'calc(100vh - 20px)' }}>
    <div className='text-center font-bold mb-8'>{image.name}</div>
    <MetadataItem label='Confidence' value={image.confidence} />
    <MetadataItem label='Status' value={image.status} />
    <MetadataItem label='Lauch data' value={dayjs(image.launch_date).format('DD-MMM-YYYY')} />
    <MetadataItem label='Status' value={image.status} />
    <div className='mt-2'>{image.description}</div>
  </div>
);

const MetadataItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className='flex justify-between text-sm border-b-gray-300 border-b-1 py-1'>
    <div className='text-gray-500'>{label}</div>
    <div>{value}</div>
  </div>
);
