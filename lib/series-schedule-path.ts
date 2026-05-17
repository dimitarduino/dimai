export function seriesSchedulePagePath(seriesGroupId: string): string {
  return `/app/shorts/series/${encodeURIComponent(seriesGroupId)}/schedule`;
}
