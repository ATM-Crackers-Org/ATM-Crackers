

type QueryValue = string | number | boolean | null | undefined;


export function buildQueryString(
  params: Record<string, QueryValue>
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== null && v !== undefined
  );
  if (!entries.length) return "";
  return (
    "?" +
    new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
  );
}
