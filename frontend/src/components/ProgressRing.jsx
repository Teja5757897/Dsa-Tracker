import { useId } from "react";

// Circular progress meter. value is 0 to 100.
const ProgressRing = ({ value = 0, size = 140, stroke = 10, label, sublabel }) => {
    const gradientId = useId().replace(/:/g, "");
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.max(0, Math.min(100, value));
    const center = size / 2;

    return (
        <div
            className="ring"
            style={{ width: size, height: size }}
            role="img"
            aria-label={`${Math.round(percent)} percent`}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="var(--marker)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - percent / 100)}
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
            </svg>
            <div className="ring-center">
                <strong>{label ?? `${Math.round(percent)}%`}</strong>
                {sublabel && <small>{sublabel}</small>}
            </div>
        </div>
    );
};

export default ProgressRing;
