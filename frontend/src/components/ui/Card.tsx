import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`card-header ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`card-body ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`card-footer ${className}`}>{children}</div>
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`card ${!hover ? 'hover:transform-none hover:shadow-none' : ''} ${className}`}>
      {children}
    </div>
  )
}
