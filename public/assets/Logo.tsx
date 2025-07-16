import * as React from 'react';

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ReLoy logo"
      role="img"
      {...props}
    >
      <title>ReLoy</title>
      <rect width="40" height="40" rx="8" fill="#233E97" />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontFamily="inherit"
      >
        RL
      </text>
    </svg>
  );
}
