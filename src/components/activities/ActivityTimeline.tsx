import { activityYear } from '@/lib/utils'
import type { Activity } from '@/types'
import { ActivityCard } from './ActivityCard'

export interface ActivityTimelineProps {
  readonly activities: readonly Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  let previousYear: string | null = null

  return (
    <div data-timeline-track className="relative mt-14 pt-10">
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[1.4rem] w-px bg-deep/10 sm:left-8 lg:left-10"
      >
        <span
          data-timeline-progress
          className="block h-full w-full origin-top bg-gradient-to-b from-turquoise via-turquoise to-turquoise/0"
        />
      </div>

      <ol>
        {activities.map((activity, index) => {
          const year = activityYear(activity.date)
          const marker = year === previousYear ? undefined : year
          previousYear = year

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              yearMarker={marker}
              variant="timeline"
            />
          )
        })}
      </ol>
    </div>
  )
}
