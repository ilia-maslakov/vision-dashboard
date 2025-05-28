export async function fetchDefaultProfile(): Promise<any> {
  const res = await fetch('/defaultProfile.json')
  if (!res.ok) throw new Error('Не удалось загрузить defaultProfile.json')
  return await res.json()
}
