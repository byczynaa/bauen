interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const base =
    'px-6 py-3 font-medium tracking-wide transition duration-300 ease-out text-sm uppercase'

  const variants: Record<string, string> = {
    primary:
      'bg-accent text-base border border-accent hover:bg-transparent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'bg-transparent text-textMain border border-textMain hover:bg-accent hover:text-base hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-accent hover:text-textMain hover:underline border-none disabled:opacity-50 disabled:cursor-not-allowed',
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  )
}
