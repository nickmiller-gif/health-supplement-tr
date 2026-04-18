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

  const match = normalizedHref.match(/^([a-zA-Z][a-zA-Z\d+.-]*):/)
  if (!match) return true

  return SAFE_SCHEMES.has(match[1].toLowerCase())
}

export function SafeMarkdown({ content }: SafeMarkdownProps) {
  return (
    <ReactMarkdown
      allowedElements={ALLOWED_ELEMENTS}
      components={{
        a: ({ href, children }) => {
          if (!isSafeHref(href)) return <span>{children}</span>
          const isExternal = /^https?:\/\//i.test(href)
          return (
            <a
              href={href}
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
