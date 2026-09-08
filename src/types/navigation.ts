export interface NavItem {
  /** Visible label. */
  readonly label: string
  /** In-page target, e.g. `#tentang`. Swap for a route path when
   *  dedicated pages (/tentang, /kegiatan, …) are introduced. */
  readonly href: string
}

export interface SocialLink {
  readonly label: string
  readonly href: string
  /** `true` while the organisation has no account yet — rendered as a
   *  non-interactive placeholder instead of a dead link. */
  readonly placeholder: boolean
}
