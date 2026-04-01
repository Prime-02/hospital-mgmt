interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 items-start justify-between mb-7 sm:flex-row sm:items-center">
      <div>
        <h1
          className="text-2xl font-bold text-slate-800"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
