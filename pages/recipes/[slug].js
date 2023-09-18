import Image from "next/image";
import { createClient } from "contentful"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

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
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug[match]': params.slug
  })

  return {
    props: {
      recipe: items[0]
    }
  }
}


export default function RecipeDetails({ recipe }) {
  const { featuredImage, title, cookingTime, ingredients, ingredientsList, method } = recipe.fields;

  return (
    <div>
      {featuredImage &&
        <div className="banner">
          <Image
            src={'https:' + featuredImage.fields.file.url}
            width={featuredImage.fields.file.details.image.width}
            height={featuredImage.fields.file.details.image.height}
            alt={'Image of' + recipe.fields.title}
          />
          <h2>{ title }</h2>
        </div>
      }

      <div className="info">
        <p>{ cookingTime }</p>
        <h3>Ingredients:</h3>
        <div>
          {documentToReactComponents(ingredients)}
        </div>
        {/* {ingredientsList.map(ingredient => (
          <span key={ingredient}>{ ingredient }</span>
        ))} */}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>
          {documentToReactComponents(method)}
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