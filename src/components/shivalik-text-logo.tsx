import * as React from "react"

export function ShivalikTextLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 100"
      width="200"
      height="50"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dy=".35em"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="60"
        fontWeight="bold"
        fill="currentColor"
      >
        Shivalik
      </text>
      <circle cx="188" cy="22" r="7" fill="currentColor" />
    </svg>
  )
}
