class BaseEntity {
  id: number;
  name: string;
}

export function indexEntitiesInArray(entities: BaseEntity[]) {
  const { indexedValues } = entities.reduce(
    (acc, currentEntity) => {
      acc.indexedValues[currentEntity.name] = currentEntity.id;
      return acc;
    },
    { indexedValues: {} },
  );

  return indexedValues;
}
