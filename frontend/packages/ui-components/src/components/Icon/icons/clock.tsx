import { SVGProps } from 'react';

export default function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 12V24H36"
        stroke="currentColor"
        strokeOpacity="0.65"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 44C35.0456 44 44 35.0456 44 24C44 12.9543 35.0456 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0456 12.9543 44 24 44Z"
        stroke="currentColor"
        strokeOpacity="0.65"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
