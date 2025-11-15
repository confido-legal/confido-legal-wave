export const graphDocsUrl =
  'https://studio.apollographql.com/public/Confido-Legal-vqze3p/variant/current/schema/reference';

export function referenceGraphDocsObject(object: string) {
  return `${graphDocsUrl}/objects/${object}`;
}

export function referenceGraphDocsInput(input: string) {
  return `${graphDocsUrl}/inputs/${input}`;
}
