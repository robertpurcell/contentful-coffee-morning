import { Client } from "@umbraco/headless-client"
import RecipeCard from "../../../components/RecipeCard"

export async function getStaticProps() {
  const client = new Client({
    projectAlias: process.env.UMBRACO_PROJECT_ALIAS,
    apiKey: process.env.UMBRACO_API_KEY
  })
  const recipesPage = await client.delivery.content.byUrl('/home/recipes')
  const data = await client.delivery.content.children(recipesPage._id)

  return {
    props: {
      recipes: data.items.map(item => ({
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
      })),
      revalidate: 10
    }
  }
}

export function getSlug(url) {
  const segments = url.split('/');

  return segments.pop() || segments.pop();
}

export default function Recipes({ recipes }) {
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} linkPath='/heartcore/recipes/' />
      ))}

      <style>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  )
}