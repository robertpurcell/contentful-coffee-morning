import { createClient } from "contentful"
import RecipeCard from "../../../components/RecipeCard"

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  const { items} = await client.getEntries({
    content_type: 'recipe'
  })

  return {
    props: {
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

export default function Recipes({ recipes }) {
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} linkPath='/contentful/recipes/' />
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