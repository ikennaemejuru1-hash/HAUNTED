// Original castle skyline. Purely decorative, so screen readers skip it.
// It lives in its own band under the hero text, so it can never sit behind words.
export function HeroArt() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none block h-full w-full"
    >
      <defs>
        <linearGradient id="castleFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B1C" />
          <stop offset="100%" stopColor="#141213" />
        </linearGradient>
      </defs>
      {/* Distant hills, full width so there are no hard edges */}
      <path d="M0 170 C150 140 300 160 450 150 C650 135 850 165 1000 145 C1080 135 1150 150 1200 145 V240 H0Z" fill="#141213" />
      {/* Castle: towers with pointed roofs, standing on the hill */}
      <path
        fill="url(#castleFade)"
        d="M330 240 V150 H345 V128 L357 100 L369 128 V150 H395 V118 L408 86 L421 118 V150 H470 V160
           H500 V110 H515 V92 L532 52 L549 92 V110 H564 V140 H585 V70 L600 20 L615 70 V140 H636
           V110 H651 V92 L668 52 L685 92 V110 H700 V160 H730 V150 H779 V118 L792 86 L805 118 V150
           H831 V128 L843 100 L855 128 V150 H870 V240Z"
      />
      {/* Lit windows: the only orange in the scene */}
      <g fill="#E87524">
        <rect x="595" y="80" width="10" height="18" rx="5" opacity="0.9" />
        <rect x="528" y="118" width="8" height="14" rx="4" opacity="0.75" />
        <rect x="664" y="118" width="8" height="14" rx="4" opacity="0.75" />
        <rect x="404" y="128" width="6" height="11" rx="3" opacity="0.55" />
        <rect x="789" y="128" width="6" height="11" rx="3" opacity="0.55" />
      </g>
      {/* Near hill sits in front of the castle base, hiding its straight side walls */}
      <path d="M0 198 C200 182 400 186 600 184 C800 182 1000 190 1200 180 V240 H0Z" fill="#141213" />
      {/* Foreground ground blends into the page background */}
      <path d="M0 215 C300 200 600 225 1200 205 V240 H0Z" fill="#0A0908" />
    </svg>
  )
}
