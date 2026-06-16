
function Info({ label, value, icon }: { label: string; value: string; icon?: any; }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium flex">{value} {icon}</p>
    </div>
  )
}

export {
    Info
}