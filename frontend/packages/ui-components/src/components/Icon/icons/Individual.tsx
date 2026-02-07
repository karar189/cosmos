import { SVGProps } from 'react';

export default function Organization(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33333 33.3333V27C8.33333 23.134 11.4673 20 15.3333 20H24.6667C28.5327 20 31.6667 23.134 31.6667 27V33.3333"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20.0003C23.6819 20.0003 26.6667 17.0156 26.6667 13.3337C26.6667 9.65176 23.6819 6.66699 20 6.66699C16.3181 6.66699 13.3333 9.65176 13.3333 13.3337C13.3333 17.0156 16.3181 20.0003 20 20.0003Z"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
