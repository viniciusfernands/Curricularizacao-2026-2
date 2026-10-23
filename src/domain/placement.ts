export interface PlacementDefinition {
  objects: readonly { id: string; targets: readonly string[] }[];
  targets: readonly { id: string; capacity: number }[];
  order?: readonly string[];
}

/** Regras de associação, distribuição e ordem, sem dependência de motor gráfico. */
export class PlacementSession {
  private readonly placed = new Set<string>();
  private readonly quantities = new Map<string, number>();
  private readonly definition: PlacementDefinition;

  constructor(definition: PlacementDefinition) {
    const objectIds = new Set(definition.objects.map(o => o.id));
    const targetIds = new Set(definition.targets.map(t => t.id));
    if (!objectIds.size || !targetIds.size || objectIds.size !== definition.objects.length || targetIds.size !== definition.targets.length ||
      definition.targets.some(t => !Number.isInteger(t.capacity) || t.capacity < 1) ||
      definition.objects.some(o => !o.targets.length || o.targets.some(t => !targetIds.has(t))) ||
      (definition.order && (definition.order.length !== objectIds.size || new Set(definition.order).size !== objectIds.size || definition.order.some(id => !objectIds.has(id))))) {
      throw new Error('Definição de posicionamento inválida.');
    }
    this.definition = structuredClone(definition);
  }

  place(objectId: string, targetId: string | null) {
    if (this.placed.size === this.definition.objects.length || this.placed.has(objectId)) return null;
    const object = this.definition.objects.find(o => o.id === objectId);
    if (!object) return null;
    const target = this.definition.targets.find(t => t.id === targetId);
    const quantity = target ? this.quantities.get(target.id) ?? 0 : 0;
    const correct = !!target && object.targets.includes(target.id) && quantity < target.capacity &&
      (!this.definition.order || this.definition.order[this.placed.size] === objectId);
    if (correct) {
      this.placed.add(objectId);
      this.quantities.set(target.id, quantity + 1);
    }
    return { correct, completed: this.placed.size === this.definition.objects.length, quantity: quantity + Number(correct) };
  }
}

export function isLargestAnimalChoice(objectId: string): boolean {
  return objectId === 'elefante';
}
