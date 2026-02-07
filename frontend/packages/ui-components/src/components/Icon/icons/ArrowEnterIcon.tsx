import { SVGProps } from 'react';

export default function ArrowEnterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20" 
      height="20" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.16667 6.75L3.25 9.66667M3.25 9.66667L6.16667 12.5833M3.25 9.66667H10.25C10.8688 9.66667 11.4623 9.42083 11.8999 8.98325C12.3375 8.54566 12.5833 7.95217 12.5833 7.33333V3.25" 
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}