const Joi = require("joi");
const { validate } = require(".");

const createWebpageSchema = Joi.object({
  navbar: Joi.object({
    logo: Joi.string().uri().required().label("Logo"),
    imageAltText: Joi.string().required().label("Image alt text"),
    websiteName: Joi.string().required().label("Website Name"),
    links: Joi.array()
      .items(Joi.string().required())
      .required()
      .min(1)
      .label("Links"),
    buttonText: Joi.string().required().label("Button Text"),
    fixedHeader: Joi.boolean().required().label("Fixed Header"),
  }),
  landing: Joi.object({
    title: Joi.string().required().label("Title"),
    subTitle: Joi.string().required().label("Subtitle"),
    hashTagTitle: Joi.string().required().label("Hashtag Title"),
    hashTags: Joi.array()
      .items(Joi.string().required())
      .required()
      .min(1)
      .label("Hastags"),
    categories: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required().label("Category Title"),
          text: Joi.string().required().label("Category Text"),
        }).required()
      )
      .required()
      .min(1)
      .label("Categories"),
        userimg: Joi.string().uri().required().label("User Image"),
    name: Joi.string().required().label("Name"),
    pronoun: Joi.string().required().label("Pronoun"),
    marquee: Joi.array()
      .items(Joi.string().required())
      .required()
      .min(1)
      .label("Marquee"),
  }),
  value: Joi.object({
    title: Joi.string().required().label("Value Title"),
    description: Joi.string().required().label("Value Description"),
    TVName: Joi.string().required().label("TV Name"), 
    video: Joi.string().uri().required().label("Video"),
    links: Joi.array()
      .items({
        title: Joi.string().required().label("Link Title"),
        link: Joi.string().uri().required().label("Link"),
      })
      .required()
      .min(1),
    buttonText: Joi.string().required().label("Button Text"),
  }),
  vision: Joi.object({
    title: Joi.string().required().label("Vision Title"),
    description: Joi.string().required().label("Vision Description"),
  }),
  CV: Joi.object({
    title: Joi.string().required().label("CV Title"),
    highlights: Joi.array().items(
      Joi.object({
        year: Joi.string().required().label("Highlights year"),
        text: Joi.string().required().label("Highlights Text"),
      }).required()
    ),
  }),
  available: Joi.object({
    title: Joi.string().required().label("Title"),
    marque: Joi.array().items(
      Joi.object({
        heading: Joi.string().required().label("Heading"),
        image: Joi.string().uri().required().label("Image"),
      })
    ),
    description: Joi.string().required().label("Description"),
    linkedin: Joi.object({
      url: Joi.string().uri().label("Url"),
      hide: Joi.boolean().label("Hide"),
    }),
    hey: Joi.object({
      url: Joi.string().uri().label("Url"),
      hide: Joi.boolean().label("Hide"),
    }),
    email: Joi.object({
      address: Joi.string().email().label("Url"),
      hide: Joi.boolean().label("Hide"),
    }),
  }),
});

function validateCreateWebpage(data) {
  return validate(data, createWebpageSchema);
}

module.exports = {
  validateCreateWebpage,
};
