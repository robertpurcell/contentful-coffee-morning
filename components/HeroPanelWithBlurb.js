import Image from "next/image";

export default function HeroPanelWithBlurb({ module }) {
  const { image, blurbTitle, blurbDescription } = module.fields;

  return (
    <div className="hero-panel">
      {image &&
        <div className="hero-image">
          <Image
            src={"https:" + image.fields.file.url}
            width={image.fields.file.details.image.width}
            height={image.fields.file.details.image.height}
            alt={image.fields.title}
          />
        </div>
      }
      <div className="blurb">
        <h2>{ blurbTitle }</h2>
        <p>{ blurbDescription }</p>
      </div>
      <style>{`
        img {
          max-width: 100%;
          height: auto;
          margin: 0px;
        }
      `}</style>
    </div>
  )
}