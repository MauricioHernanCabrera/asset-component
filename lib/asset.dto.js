const { CrudDTO } = require("crud-component");

class AssetDTO extends CrudDTO {
  constructor({ Joi }) {
    super();
    this.Joi = Joi;
  }

  createOne = ({ isLocal = true } = {}) => {
    if (isLocal) {
      return this.Joi.object().keys({
        userId: this.Joi.mongoId().required(),
        file: this.Joi.object().required(),
        folder: this.Joi.string().required(),
      });
    }

    return this.Joi.object().keys({
      cloudinaryId: this.Joi.string().required(),
      original: this.Joi.string().required(),
    });
  };

  updateOne = () => {};
}

module.exports = AssetDTO;
