import { createClient } from "contentful"
import RecipeCard from "../../../components/RecipeCard"
import SearchForm from "../../../components/SearchForm";

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
  const { categories, recipes } = props;

  return (
    <div className="wrapper">
      <div className="filters">
        <SearchForm categories={categories} />
      </div>
      <div className="recipe-list">
        {recipes.length > 0 ? recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} linkPath='/contentful/recipes/' />
        )) : <p>No results found</p>}
      </div>
      <style>{`
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