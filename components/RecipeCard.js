import Link from "next/link";
import Image from "next/image";

export default function RecipeCard({ recipe }) {
  const { title, slug, cookingTime, thumbnail } = recipe.fields;

  return (
    <div className="card">
      {thumbnail &&
        <div className="featured">
          <Image
            src={'https:' + thumbnail.fields.file.url}
            width={thumbnail.fields.file.details.image.width}
            height={thumbnail.fields.file.details.image.height}
            alt={'Image of' + recipe.fields.title}
          />
        </div>
      }
      <div className="content">
        <div className="info">
          <h4>{ title }</h4>
          <p>{ cookingTime }</p>
        </div>
        <div className="actions">
          <Link href={'/recipes/' + slug}>Read the recipe</Link>
        </div>
      </div>

      <style>{`
        .content {
          background: #fff;
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
          margin: 0;
          position: relative;
          top: -40px;
          left: -10px;
        }
        .info {
          padding: 16px;
        }
        .info h4 {
          margin: 4px 0;
          text-transform: uppercase;
        }
        .info p {
          margin: 0;
          color: #777;
        }
        .actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .actions a {
          color: #fff;
          background: #5e4f9c;
          padding: 16px 24px;
          text-decoration: none;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  )
}