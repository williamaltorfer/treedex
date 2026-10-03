export type TreeForm = 'standard' | 'small' | 'conifer' | 'vase' | 'weeping'

const FORM_OVERRIDES: Record<string, TreeForm> = {
  'bald-cypress': 'conifer',
  'american-elm': 'vase',
  'black-willow': 'weeping',
  'eastern-redbud': 'small',
  'japanese-maple': 'small',
  'downy-hawthorn': 'small',
  serviceberry: 'small',
  'japanese-tree-lilac': 'small',
}

export function treeForm(speciesId: string): TreeForm {
  return FORM_OVERRIDES[speciesId] ?? 'standard'
}
