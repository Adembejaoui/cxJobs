interface InfoItemProps {
  label: string
  value: string | number
  valueClassName?: string
}

export function InfoItem({ label, value, valueClassName }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold ${valueClassName || ""}`}>{value}</p>
    </div>
  )
}
