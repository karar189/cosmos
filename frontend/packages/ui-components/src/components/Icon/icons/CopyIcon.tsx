import { SVGProps } from "react";

export default function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.332 5.33203H6.66536C5.92898 5.33203 5.33203 5.92898 5.33203 6.66536V13.332C5.33203 14.0684 5.92898 14.6654 6.66536 14.6654H13.332C14.0684 14.6654 14.6654 14.0684 14.6654 13.332V6.66536C14.6654 5.92898 14.0684 5.33203 13.332 5.33203Z"
        stroke="currentColor"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66536 10.6654C1.93203 10.6654 1.33203 10.0654 1.33203 9.33203V2.66536C1.33203 1.93203 1.93203 1.33203 2.66536 1.33203H9.33203C10.0654 1.33203 10.6654 1.93203 10.6654 2.66536"
        stroke="currentColor"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
