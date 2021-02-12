const { CrudFilter } = require("crud-component");

class AssetFilter extends CrudFilter {
  createOne = (req, res, next) => {
    req.body = { ...req.body, userId: req.user.sub, file: req.file };

    next();
  };
}

module.exports = AssetFilter;
