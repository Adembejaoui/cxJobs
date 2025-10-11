interface SectionHeaderProps {
  title: string
  className?: string
}

export function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return <h3 className={`text-xl font-bold mb-4 ${className}`}>{title}</h3>
}
