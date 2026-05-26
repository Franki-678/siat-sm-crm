"use client";

interface ScoreBarProps {
  value: number;
  className?: string;
  height?: string;
}

export function ScoreBar({ value, className = "", height = "h-3" }: ScoreBarProps) {
  const pct = Math.min(Math.max(value * 100, 0), 100);

  const getColor = () => {
    if (value >= 0.75) return "from-red-500 to-red-600";
    if (value >= 0.5) return "from-orange-400 to-orange-500";
    if (value >= 0.25) return "from-yellow-400 to-yellow-500";
    return "from-green-400 to-green-500";
  };

  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`${height} rounded-full bg-gradient-to-r ${getColor()} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
