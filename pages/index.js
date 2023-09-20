import { createClient } from "contentful"
import Components from "../components/components.js";

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  const { items } = await client.getEntries({
    content_type: 'home'
  })

  return {
    props: {
      home: items[0],
      revalidate: 10
    }
  }
}

export default function Home({ home }) {
  return (
    <div className="modules">
      {home.fields.modules.map(module => Components(
        module.sys.contentType.sys.id,
        module.sys.id,
        module
      ))}
    </div>
  )
}
