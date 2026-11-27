interface Props { label: string; className?: string; }
export function PlaceholderImage({ label, className = '' }: Props) {
  return <div className={`image-placeholder ${className}`} role="img" aria-label={label}><span className="placeholder-mark">✳</span><span>{label}</span></div>;
}
