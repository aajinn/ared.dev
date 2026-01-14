interface BadgeProps {
  label: string;
  color: string;
  logo?: string;
}

export default function Badge({ label, color, logo }: BadgeProps) {
  return (
    <span 
      className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white rounded"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
