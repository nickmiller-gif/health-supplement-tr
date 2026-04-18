import ReactMarkdown from 'react-markdown'

interface SafeMarkdownProps {
  content: string
}

const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])
const ALLOWED_ELEMENTS: string[] = [
  'p',
  'strong',
  'em',
  'del',
  'ul',
  'ol',
  'li',
  'a',
  'blockquote',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'hr',
  'br'
]

function isSafeHref(href?: string) {
  if (!href) return false
  const normalizedHref = href.trim()
  if (!normalizedHref || normalizedHref.startsWith('//')) return false
  if (normalizedHref.startsWith('/') || normalizedHref.startsWith('#')) return true

  const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(normalizedHref)
  if (!hasExplicitScheme) return true

  try {
    const scheme = new URL(normalizedHref).protocol.replace(':', '').toLowerCase()
    return SAFE_SCHEMES.has(scheme)
  } catch {
    return false
  }
}

export function SafeMarkdown({ content }: SafeMarkdownProps) {
  return (
    <ReactMarkdown
      allowedElements={ALLOWED_ELEMENTS}
      components={{
        a: ({ href, children }) => {
          const safeHref = href?.trim()
          if (!safeHref || !isSafeHref(safeHref)) return <span>{children}</span>
          const isExternal = /^https?:\/\//i.test(safeHref)
          return (
            <a
              href={safeHref}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer nofollow' : undefined}
            >
              {children}
            </a>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
