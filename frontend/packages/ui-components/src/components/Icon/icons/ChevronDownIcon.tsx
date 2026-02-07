import { SVGProps } from 'react';

export default function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.5 4.75L3 6.25L8 11.25L13 6.25L11.5 4.75L8 8.25L4.5 4.75Z" fill="currentColor" />
    </svg>
  );
}
