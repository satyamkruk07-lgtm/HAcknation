
import * as React from "react"

export function ShivalikLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 130"
      width="150"
      height="39"
      {...props}
    >
      <style>
        {
          ".sce-text{font-family:Garamond,serif;font-weight:700;font-size:40px;letter-spacing:2px}.sce-subtext{font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px}"
        }
      </style>
      <path
        fill="#D4AF37"
        d="M50 10 A40 40 0 0 1 50 90 A40 40 0 0 1 50 10 M50 20 A30 30 0 0 1 50 80 A30 30 0 0 1 50 20"
      />
      <text
        x="50%"
        y="50"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#000080"
        className="sce-text"
      >
        SHIVALIK COLLEGE
      </text>
      <text
        x="50%"
        y="75"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#000080"
        className="sce-subtext"
      >
        OF ENGINEERING
      </text>
      <text
        x="50%"
        y="100"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#DAA520"
        fontSize="10"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        DEHRADUN
      </text>
      <circle cx="25" cy="50" r="5" fill="#000080" />
      <circle cx="475" cy="50" r="5" fill="#000080" />
    </svg>
  )
}
