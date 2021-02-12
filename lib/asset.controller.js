const { CrudController } = require("crud-component");

class AssetController extends CrudController {
  constructor() {
    super({
      serviceName: "assetService",
      idName: "assetId",
      successMessages: {
        createOne: "¡Recurso creado!",
        getAll: "¡Recursos obtenidos!",
        getOne: "¡Recurso obtenido!",
        updateOne: "¡Recurso actualizado!",
        deleteOne: "¡Recurso eliminado!",
        reorderAll: "¡Recursos reordenados!",
      },
    });
  }
}

module.exports = AssetController;
