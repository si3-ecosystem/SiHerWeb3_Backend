const Joi = require("joi")
const { validate } = require(".")

const createWebpageSchema = Joi.object({
  navbar: Joi.object({
    websiteName: Joi.string().required().label("Website Name"),
    links: Joi.array()
      .items(Joi.string().required())
      .required()
      .min(1)
      .label("Links"),
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
        }).required()
      )
      .required()
      .min(1)
      .label("Categories"),
      userimg: Joi.object({
        path: Joi.string().required().label('User image path'),
        id: Joi.alternatives(Joi.string().allow(null)).label('User image id')
      }),
    // userimg: Joi.string().uri().required().label("User Image"),
    name: Joi.string().required().label("Name"),
    pronoun: Joi.string().required().label("Pronoun"),
  }),
  value: Joi.object({
    title: Joi.string().required().label("Value Title"),
    description: Joi.string().required().label("Value Description"),
    TVName: Joi.string().required().label("TV Name"),
    video: Joi.object({
      path: Joi.string().required().label('Video path'),
      id: Joi.alternatives(Joi.string().allow(null), Joi.allow(null)).label('Video id')
    }).label('Video Object'),
    // video: Joi.string().uri().required().label("Video"),
    links: Joi.array()
      .items({
        title: Joi.string().required().label("Link Title"),
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
    present: Joi.object({
      title: Joi.string().required().label("CV Title"),
      highlights: Joi.array().items(
        Joi.object({
          year: Joi.string().required().label("Highlights year"),
          text: Joi.string().required().label("Highlights Text"),
        }).required()
      ),
    })
      .required()
      .label("Present"),
    past: Joi.object({
      title: Joi.string().required().label("Past Title"),
      highlights: Joi.array().items(Joi.string().required()),
    })
      .required()
      .label("Past"),
    future: Joi.object({
      title: Joi.string().required().label("Future Title"),
      text: Joi.string().required().label("Future Text"),
    })
      .required()
      .label("Future"),
  }),
  available: Joi.object({
    title: Joi.string().required().label("Title"),
    marque: Joi.array().items(
      Joi.object({
        heading: Joi.string().required().label("Heading"),
      })
    ),
    linkedin: Joi.object({
      url: Joi.string().label("Linkedin Url"),
      hide: Joi.boolean().label("Hide"),
    }),
    instagram: Joi.object({
      url: Joi.string().label("Instagram Url"),
      hide: Joi.boolean().label("Hide"),
    }),
    twitter: Joi.object({
      url: Joi.string().label("Twitter Url"),
      hide: Joi.boolean().label("Hide"),
    }),
    email: Joi.object({
      address: Joi.string().email().label("Email Address"),
      hide: Joi.boolean().label("Hide"),
    }),
  }),
})

function validateCreateWebpage(data) {
  return validate(data, createWebpageSchema)
}

module.exports = {
  validateCreateWebpage,
}
