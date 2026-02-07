import { SVGProps } from 'react';

export default function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.75 11.5L6.25 13L11.25 8L6.25 3L4.75 4.5L8.25 8L4.75 11.5Z" fill="currentColor" />
    </svg>
  );
}
