import React from 'react';

interface SakuraIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const SakuraIcon: React.FC<SakuraIconProps> = ({
  className = 'w-5 h-5',
  size,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <g transform="translate(12, 12)">
        <path
          d="M 0 -2.5 C -3 -5, -4.5 -8.5, -2.5 -11 C -1.5 -11.5, -0.8 -10.8, 0 -9.5 C 0.8 -10.8, 1.5 -11.5, 2.5 -11 C 4.5 -8.5, 3 -5, 0 -2.5 Z"
          fill="currentColor"
        />
        <g transform="rotate(72)">
          <path
            d="M 0 -2.5 C -3 -5, -4.5 -8.5, -2.5 -11 C -1.5 -11.5, -0.8 -10.8, 0 -9.5 C 0.8 -10.8, 1.5 -11.5, 2.5 -11 C 4.5 -8.5, 3 -5, 0 -2.5 Z"
            fill="currentColor"
          />
        </g>
        <g transform="rotate(144)">
          <path
            d="M 0 -2.5 C -3 -5, -4.5 -8.5, -2.5 -11 C -1.5 -11.5, -0.8 -10.8, 0 -9.5 C 0.8 -10.8, 1.5 -11.5, 2.5 -11 C 4.5 -8.5, 3 -5, 0 -2.5 Z"
            fill="currentColor"
          />
        </g>
        <g transform="rotate(216)">
          <path
            d="M 0 -2.5 C -3 -5, -4.5 -8.5, -2.5 -11 C -1.5 -11.5, -0.8 -10.8, 0 -9.5 C 0.8 -10.8, 1.5 -11.5, 2.5 -11 C 4.5 -8.5, 3 -5, 0 -2.5 Z"
            fill="currentColor"
          />
        </g>
        <g transform="rotate(288)">
          <path
            d="M 0 -2.5 C -3 -5, -4.5 -8.5, -2.5 -11 C -1.5 -11.5, -0.8 -10.8, 0 -9.5 C 0.8 -10.8, 1.5 -11.5, 2.5 -11 C 4.5 -8.5, 3 -5, 0 -2.5 Z"
            fill="currentColor"
          />
        </g>

        <circle cx="0" cy="0" r="2.8" fill="rgba(255, 255, 255, 0.45)" />
        <circle cx="0" cy="0" r="1.3" fill="currentColor" />

        <circle cx="0" cy="-2.2" r="0.45" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="2.1" cy="-0.7" r="0.45" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="1.3" cy="1.8" r="0.45" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="-1.3" cy="1.8" r="0.45" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="-2.1" cy="-0.7" r="0.45" fill="rgba(255, 255, 255, 0.9)" />
      </g>
    </svg>
  );
};
