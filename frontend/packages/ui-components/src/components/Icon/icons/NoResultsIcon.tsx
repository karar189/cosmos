import { SVGProps } from 'react';

export default function NoResultsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M27 17L17 27" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 17L27 27" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 38C30.8366 38 38 30.8366 38 22C38 13.1634 30.8366 6 22 6C13.1634 6 6 13.1634 6 22C6 30.8366 13.1634 38 22 38Z" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 41.9999L33.4 33.3999" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
