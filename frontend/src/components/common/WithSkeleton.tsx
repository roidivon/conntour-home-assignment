import type { ReactNode } from 'react';

export const WithSkeleton = ({
  isLoading,
  skeleton,
  children,
}: {
  isLoading: boolean;
  skeleton: ReactNode;
  children?: ReactNode;
}) => (isLoading ? skeleton : children);
