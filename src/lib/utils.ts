import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeTargetUrl(input: string): { normalizedUrl?: string; error?: string } {
  const trimmed = input.trim()
  if (!trimmed) {
    return { error: 'Please enter a target URL.' }
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const parsed = new URL(withProtocol)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { error: 'URL must start with http:// or https://.' }
    }

    const hostname = parsed.hostname
    const isIpv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(hostname)
    const hasDomainLikeHost = hostname.includes('.') || hostname === 'localhost' || isIpv4
    if (!hasDomainLikeHost) {
      return { error: 'Please enter a valid URL host (for example, https://example.com).' }
    }

    return { normalizedUrl: parsed.toString() }
  } catch {
    return { error: 'Please enter a valid URL (for example, https://example.com).' }
  }
}
