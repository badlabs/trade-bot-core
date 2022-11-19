export interface ITypedTransformer<TEntity, TDatabase> {
    to: (entityValue: TEntity) => TDatabase;
    from: (databaseValue: TDatabase) => TEntity;
}