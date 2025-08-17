import classNames from 'classnames';

export const ErrorMessage = ({ message, className }: { message: string; className?: string }) => (
  <div className={classNames('text-center w-full text-red-500 mt-48', className)}>{message}</div>
);
