import Image from "next/image";
import { createClient } from "contentful"
import parse from 'html-react-parser'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import Skeleton from "../../../components/Skeleton";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export async function getStaticPaths() {
  const res = await client.getEntries({
    content_type: 'recipe'
  })

  const paths = res.items.map(recipe => {
    return {
      params: { slug: recipe.fields.slug }
    }
  })

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug[match]': params.slug
  })

  if (!items.length) {
    return {
      notFound: true
    }
  }

  const item = items[0];

  return {
    props: {
      recipe: {
        title: item.fields.title,
        featuredImage: item.fields.featuredImage && {
          url: 'https:' + item.fields.featuredImage.fields.file.url,
          width: item.fields.featuredImage.fields.file.details.image.width,
          height: item.fields.featuredImage.fields.file.details.image.height,
          altText: item.fields.featuredImage.fields.title
        } || null,
        cookingTime: item.fields.cookingTime || null,
        ingredients: documentToHtmlString(item.fields.ingredients),
        method: documentToHtmlString(item.fields.method)
      },
      revalidate: 10
    }
  }
}


export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Skeleton />

  const { featuredImage, title, cookingTime, ingredients, method } = recipe;

  return (
    <div>
      <div className="banner">
        {featuredImage &&
          <Image
            src={featuredImage.url}
            width={featuredImage.width}
            height={featuredImage.height}
            alt={featuredImage.altText}
          />
        }
        <h2>{ title }</h2>
      </div>

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