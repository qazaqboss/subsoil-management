interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-700',
  success: 'from-success-500 to-green-600',
  warning: 'from-warning-500 to-amber-600',
  error: 'from-error-500 to-red-600',
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-6',
  lg: 'h-8',
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  color = 'primary',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden relative ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && size !== 'sm' && (
            <span className="text-white text-xs font-semibold">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  )
}
