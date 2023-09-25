import { Client } from "@umbraco/headless-client"
import RecipeCard from "../../../components/RecipeCard"
import SearchForm from "../../../components/SearchForm";

const client = new Client({
  projectAlias: process.env.UMBRACO_PROJECT_ALIAS,
  apiKey: process.env.UMBRACO_API_KEY
})

export async function getServerSideProps({ query }) {
  const category = query.category;
  const searchQuery = query.searchQuery;

  var items;
  if (searchQuery) {
    // If we have a search term we need to search on all content first and then filter by content type and category.
    items = (await client.delivery.content.search(searchQuery))
      .items
      .filter(item => item.contentTypeAlias == 'recipePage' && (!category || item.categories.includes(category)));
  } else if (category) {
    // If we have a category we can use the filter function to filter the items.
    const contentFilter = {
      "contentTypeAlias": "recipePage",
      "properties": [
      {
        "alias": "categories",
        "value": category,
        "match": "CONTAINS"
      }]
    };
    items = (await client.delivery.content.filter(contentFilter)).items;
  } else {
    // If we have neither then we just return all recipe pages.
    items = (await client.delivery.content.byContentType("recipePage")).items;
  }

  const recipes = items
    .map(item => ({
      id: item._id,
      title: item.title,
      slug: getSlug(item._url),
      cookingTime: item.cookingTime,
      thumbnail: {
        url: item.thumbnail.src,
        width: item.thumbnail.media.umbracoWidth,
        height: item.thumbnail.media.umbracoHeight,
        altText: item.thumbnail.media.name
      }
    }));

  const categories = await getCategories();

  return {
    props: {
      categories,
      recipes,
      revalidate: 10,
    }
  }
}

async function getCategories() {
  return [
    {
      name: "Savouries",
      value: "Savouries"
    },
    {
      name: "Cakes and traybakes",
      value: "Cakes and traybakes"
    },
    {
      name: "Free from / vegan",
      value: "Free from / vegan"
    }
  ];
}

export function getSlug(url) {
  const segments = url.split('/');

  return segments.pop() || segments.pop();
}

export default function Recipes(props) {
  const { categories, recipes } = props;
  console.log(recipes)
  return (
    <div className="wrapper">
      <div className="filters">
        <SearchForm categories={categories} />
      </div>
      <div className="recipe-list">
        {recipes.length > 0 ? recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} linkPath='/heartcore/recipes/' />
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