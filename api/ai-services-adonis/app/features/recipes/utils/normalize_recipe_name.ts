export function normalizeRecipeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr-FR')
}
