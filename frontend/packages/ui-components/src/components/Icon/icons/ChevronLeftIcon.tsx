import { SVGProps } from 'react';

export default function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.25 4.5L9.75 3L4.75 8L9.75 13L11.25 11.5L7.75 8L11.25 4.5Z" fill="currentColor" />
    </svg>
  );
}
