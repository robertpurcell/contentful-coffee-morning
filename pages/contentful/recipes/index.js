import { createClient } from "contentful"
import RecipeCard from "../../../components/RecipeCard"
import { useRouter } from 'next/router'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export async function getServerSideProps({ query }) {
  const category = query.category;
  const searchQuery = query.searchQuery;

  const { items } = await client.getEntries({
    content_type: 'recipe',
    query: searchQuery && searchQuery.length > 2 ? searchQuery : undefined,
    'metadata.tags.sys.id[in]': category ? category : undefined,
  })

  const categories = await getCategories();

  return {
    props: {
      categories,
      recipes: items.map(item => ({
        id: item.sys.id,
        title: item.fields.title,
        slug: item.fields.slug,
        cookingTime: item.fields.cookingTime || null,
        thumbnail: {
          url: "https:" + item.fields.thumbnail.fields.file.url,
          width: item.fields.thumbnail.fields.file.details.image.width,
          height: item.fields.thumbnail.fields.file.details.image.height,
          altText: item.fields.thumbnail.fields.title
        }
      })),
      revalidate: 10
    }
  }
}

async function getCategories() {
  const { items } = await client.getTags()

  return items
    .filter(tag => tag.sys.id.startsWith("category"))
    .map((tag) => {
      return {
        name: tag.name.replace("Category: ", ""),
        value: tag.sys.id
      };
    })
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
}

export default function Recipes(props) {
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
    filterSearch({ category: e.target.value })
  };
  
  const queryHandler = (e) => {
    filterSearch({ searchQuery: e.target.value })
  };

  const { categories, recipes } = props;

  return (
    <div className="wrapper">
      <div className="filters">
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
      </div>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} linkPath='/contentful/recipes/' />
        ))}
      </div>
      <style>{`
          input[type=text], select {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .wrapper {
            display: grid;
            grid-gap: 20px;
            grid-template-columns: 1fr 3fr;
          }
          .recipe-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
          }
          @media (max-width: 500px) {
            .wrapper {
              display: grid;
              grid-gap: 0px;
              grid-template-columns: 1fr;
            }
            .recipe-list {
              display: grid;
              grid-gap: 0px;
              grid-template-columns: 1fr;
            }
          }
        `}</style>
    </div>
  )
}