export function multiWordParser (current: string, prev?: string): string {
  return prev === undefined ? current : `${prev} ${current}`
}
