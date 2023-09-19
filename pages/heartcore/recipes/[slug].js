import { Client } from "@umbraco/headless-client"
import Image from "next/image";
import parse from 'html-react-parser'

const client = new Client({
  projectAlias: process.env.UMBRACO_PROJECT_ALIAS,
  apiKey: process.env.UMBRACO_API_KEY
})

export async function getStaticPaths() {
  const recipesPage = await client.delivery.content.byUrl('/home/recipes')
  const data = await client.delivery.content.children(recipesPage._id)

  const paths = data.items.map(recipe => {
    return {
      params: { slug: getSlug(recipe._url) }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const item = await client.delivery.content.byUrl('/home/recipes/' + params.slug)
  return {
    props: {
      recipe: {
        title: item.title,
        featuredImage: item.featuredImage && {
          url: item.featuredImage.src,
          width: item.featuredImage.media.umbracoWidth,
          height: item.featuredImage.media.umbracoHeight,
          altText: item.featuredImage.media.name
        } || null,
        cookingTime: item.cookingTime || null,
        ingredients: item.ingredients,
        method: item.method
      }
    }
  }
}

export function getSlug(url) {
  const segments = url.split('/');

  return segments.pop() || segments.pop();
}

export default function RecipeDetails({ recipe }) {
  const { featuredImage, title, cookingTime, ingredients, method } = recipe;

  return (
    <div>
      {featuredImage &&
        <div className="banner">
          <Image
            src={featuredImage.url}
            width={featuredImage.width}
            height={featuredImage.height}
            alt={featuredImage.altText}
          />
          <h2>{ title }</h2>
        </div>
      }

      <div className="info">
        <p>{ cookingTime }</p>
        <h3>Ingredients:</h3>
        <div>
          {parse(ingredients)}
        </div>
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>
        {parse(method)}
        </div>
      </div>

      <style>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}