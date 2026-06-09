
function Info({ label, value }: { label: string; value: string; }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export {
    Info
}