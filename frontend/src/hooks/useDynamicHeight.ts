import { type RefObject, useEffect, useState } from 'react';

export const useDynamicHeight = (rootRef: RefObject<HTMLDivElement | null>) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (rootRef.current) {
      setHeight(rootRef.current.clientHeight);
    }
  }, [rootRef.current]);
  return { rootRef, height };
};
