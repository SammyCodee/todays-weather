import type { SVGProps } from 'react';

/**
 * Small inline SVG icons. They inherit the text colour (`currentColor`) and
 * are hidden from screen readers — the button that holds them supplies the label.
 */
type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </BaseIcon>
);

export const TrashIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </BaseIcon>
);

export const CloseIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </BaseIcon>
);

export const SunIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </BaseIcon>
);

export const MoonIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </BaseIcon>
);

export const SpinnerIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M21 12a9 9 0 1 1-6.2-8.6" />
  </BaseIcon>
);
