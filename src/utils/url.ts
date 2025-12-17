export function url(path: string) {
  return new URL(
    path,
    typeof window !== `undefined`
      ? window.location.origin
      : `http://localhost:5173`,
  ).toString()
}
