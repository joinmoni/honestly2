type Column<T> = {
  key: keyof T;
  label: string;
};

type AdminTableProps<T extends Record<string, string | number | boolean | null | undefined>> = {
  columns: Column<T>[];
  rows: T[];
};

export function AdminTable<T extends Record<string, string | number | boolean | null | undefined>>({ columns, rows }: AdminTableProps<T>) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-muted">
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-line last:border-none">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3">
                  {String(row[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
