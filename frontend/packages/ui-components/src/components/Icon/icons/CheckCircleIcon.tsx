import { SVGProps } from 'react';

export default function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_622_4157)">
        <path
          d="M8 0.833008C11.958 0.833008 15.167 4.04196 15.167 8C15.167 11.958 11.958 15.167 8 15.167C4.04196 15.167 0.833008 11.958 0.833008 8C0.833008 4.04196 4.04196 0.833008 8 0.833008ZM11.6865 5.31348C11.4913 5.11825 11.1747 5.11823 10.9795 5.31348L6.66699 9.62598L5.02051 7.97949C4.82534 7.78436 4.50875 7.78453 4.31348 7.97949C4.11823 8.17474 4.11825 8.49126 4.31348 8.68652L6.31348 10.6865C6.50874 10.8818 6.82525 10.8818 7.02051 10.6865L11.6865 6.02051C11.8818 5.82525 11.8818 5.50874 11.6865 5.31348Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_622_4157">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
