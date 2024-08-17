namespace Core.Interfaces.Repository
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task AddAsync(TEntity entity);

        Task UpdateAsync(TEntity entityToUpdate);

        void Delete(object id);

        void DeleteByEntity(TEntity entityToDelete);

        Task SaveAsync();

        Task<IEnumerable<TEntity>> GetAllAsync();

        Task<TEntity> GetByIdAsync(object id);
    }
}