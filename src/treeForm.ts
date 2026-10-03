export type TreeForm = 'standard' | 'small' | 'conifer' | 'vase' | 'weeping' | 'spreading'

const FORM_OVERRIDES: Record<string, TreeForm> = {
  'bald-cypress': 'conifer',
  'american-elm': 'vase',
  'black-willow': 'weeping',
  'eastern-redbud': 'small',
  'japanese-maple': 'small',
  'downy-hawthorn': 'small',
  serviceberry: 'small',
  'japanese-tree-lilac': 'small',
  // Oaks are explicitly described as wide and horizontally spreading in their own winter clues.
  'bur-oak': 'spreading',
  'northern-red-oak': 'spreading',
  'white-oak': 'spreading',
  'swamp-white-oak': 'spreading',
}

export function treeForm(speciesId: string): TreeForm {
  return FORM_OVERRIDES[speciesId] ?? 'standard'
}
