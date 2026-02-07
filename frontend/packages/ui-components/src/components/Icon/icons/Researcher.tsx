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
        d="M35 20V13.3333C35 10.5719 32.7614 8.33333 30 8.33333H10C7.23858 8.33333 5 10.5719 5 13.3333V20C5 22.7614 7.23858 25 10 25H20"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.5402 31.8648C34.4423 30.9604 35 29.7123 35 28.334C35 25.5726 32.7614 23.334 30 23.334C27.2386 23.334 25 25.5726 25 28.334C25 31.0954 27.2386 33.334 30 33.334C31.3831 33.334 32.635 32.7724 33.5402 31.8648ZM33.5402 31.8648L36.6667 35.0007"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
