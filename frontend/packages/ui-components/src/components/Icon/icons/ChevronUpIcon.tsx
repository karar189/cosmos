import { SVGProps } from 'react';

export default function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.5 11.25L3 9.75L8 4.75L13 9.75L11.5 11.25L8 7.75L4.5 11.25Z" fill="currentColor" />
    </svg>
  );
}
