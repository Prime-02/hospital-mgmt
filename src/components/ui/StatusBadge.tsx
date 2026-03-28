interface StatusBadgeProps {
  status: string;
}

const labels: Record<string, string> = {
  active: 'Active',
  stable: 'Stable',
  critical: 'Critical',
  discharged: 'Discharged',
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  on_leave: 'On Leave',
  inactive: 'Inactive',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {labels[status] ?? status}
    </span>
  );
}
