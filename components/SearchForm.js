import { useRouter } from 'next/router'

export default function SearchForm({ categories }) {
  const router = useRouter()

  const {
    searchQuery = '',
    category = ''
  } = router.query;

  const filterSearch = ({
    searchQuery,
    category,
  }) => {
    const { query } = router;
    query.searchQuery = searchQuery;
    query.category = category;
  
    router.push({
      pathname: router.pathname,
      query: query
    });
  }
  
  const categoryHandler = (e) => {
    filterSearch({ searchQuery: searchQuery, category: e.target.value })
  };
  
  const queryHandler = (e) => {
    filterSearch({ searchQuery: e.target.value, category: category })
  };

  return (
    <div className="search-form">
     <label htmlFor="search">Search</label>
      <input
        onChange={queryHandler}
        name="search"
        type="text"
        placeholder="Ingredient or keyword"
        autoComplete="off"
        value={searchQuery}
      />
      <label htmlFor="category">Category</label>
      <select
        name="category"
        value={category}
        onChange={categoryHandler}
      >
        <option value="">All</option>
        {categories &&
          categories.map(c => (
            <option key={c.value} value={c.value}>
              {c.name}
            </option>
          ))
        }
      </select>
      <style jsx>{`
        input[type=text], select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}