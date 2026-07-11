import { CalendarDays } from "lucide-react";

import type { UpdateLog } from "@/types";

import styles from "./detail.module.css";

export interface UpdateTimelineProps {
  updates: UpdateLog[];
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function UpdateTimeline({ updates }: UpdateTimelineProps) {
  if (updates.length === 0) {
    return null;
  }

  const sortedUpdates = [...updates].sort(
    (left, right) => Date.parse(right.date) - Date.parse(left.date),
  );

  return (
    <ol className={styles.timeline}>
      {sortedUpdates.map((update) => (
        <li className={styles.timelineItem} key={update.id}>
          <span aria-hidden="true" className={styles.timelineMarker}>
            <CalendarDays />
          </span>
          <div>
            <time dateTime={update.date}>{dateFormatter.format(new Date(update.date))}</time>
            <h3>{update.title}</h3>
            <p>{update.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
