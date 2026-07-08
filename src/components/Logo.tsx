interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer shield */}
      <path
        d="M24 4L6 12V22C6 33.5 13.5 42.5 24 46C34.5 42.5 42 33.5 42 22V12L24 4Z"
        fill="url(#shieldGradient)"
        stroke="currentColor"
        strokeWidth="0"
      />
      {/* Inner circuit / network pattern */}
      <circle cx="24" cy="20" r="4" fill="white" fillOpacity="0.95" />
      <path
        d="M24 16V10M24 24V30M20 20H14M28 20H34"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <circle cx="24" cy="10" r="2.5" fill="white" fillOpacity="0.85" />
      <circle cx="24" cy="30" r="2.5" fill="white" fillOpacity="0.85" />
      <circle cx="14" cy="20" r="2.5" fill="white" fillOpacity="0.85" />
      <circle cx="34" cy="20" r="2.5" fill="white" fillOpacity="0.85" />
      {/* Subtle bottom arc */}
      <path
        d="M16 34C18.5 37 21 38.5 24 38.5C27 38.5 29.5 37 32 34"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <defs>
        <linearGradient id="shieldGradient" x1="24" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  );
}
