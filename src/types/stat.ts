export interface OceanStat {
  readonly id: string
  /** An editorial marker (`01`, `∞`), not a measured quantity — the group
   *  has no published figures yet. See `data/stats.ts`. */
  readonly marker: string
  readonly label: string
  readonly description: string
}
