const { unlinkSync } = require("fs");
const { CrudService } = require("crud-component");

class AssetService extends CrudService {
  constructor({ folders = [], baseFolder = "", cloudinary }) {
    super({
      modelName: "AssetModel",
      notFoundMessage: "¡No se encontro el recurso!",
    });

    this.folders = folders;
    this.baseFolder = baseFolder;
    this.cloudinary = cloudinary;

    this.formatDoc = ({ _id, sizes, original, cloudinaryId, createdAt, updatedAt }) => {
      return {
        _id,
        sizes,
        original,
        cloudinaryId,
        createdAt,
        updatedAt,
      };
    };
  }

  imageSizes = [480, 240];
  imageTypes = ["image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp"];

  videoSizes = [];
  videoTypes = ["video/webm", "video/mp4", "video/ogg"];

  validAssetType = ["image", "video"];

  createAssetSizes = (sizes, filePath, { folder, resourceType }) => {
    return Promise.all(
      sizes.map((width) =>
        this.createAssetSize(filePath, { width, folder, resourceType })
      )
    );
  };

  createAssetSize = async (filePath, { folder, width, resourceType }) => {
    const options = { folder };

    if (width) options["transformation"] = [{ width }];
    if (resourceType) options["resource_type"] = resourceType;

    const {
      secure_url: url,
      width: size,
      asset_id: cloudinaryId,
    } = await this.cloudinary.uploader.upload(filePath, options);

    return { url, size, cloudinaryId };
  };

  getAssetType = (mimetype) => {
    if (this.imageTypes.includes(mimetype)) return "image";
    if (this.videoTypes.includes(mimetype)) return "video";

    return null;
  };

  createOne = async ({ userId, file, folder, cloudinaryId, original }) => {
    const isLocal = file && folder;

    if (isLocal) {
      const resourceType = this.getAssetType(file.mimetype);

      if (!this.folders.includes(folder)) {
        unlinkSync(file.path);
        return Promise.reject({ status: 400, message: "Carpeta invalida" });
      }

      const folderPath = `${this.baseFolder}/${folder}`;

      const { url: original, cloudinaryId } = await this.createAssetSize(file.path, {
        folder: folderPath,
        resourceType,
      });

      const assetCreated = await this[this.modelName].create({
        original,
        cloudinaryId,
        owner: userId,
      });

      if (this.validAssetType.includes(this.imageTypes)) {
        this.createAssetSizes(this.imageSizes, file.path, {
          folder: folderPath,
          resourceType,
        })
          .then(async (sizes) => {
            assetCreated.sizes = sizes;
            await assetCreated.save();
            unlinkSync(file.path);
          })
          .catch((error) => console.log(error));
      } else if (this.validAssetType.includes(this.videoTypes)) {
        this.createAssetSizes(this.videoSizes, file.path, {
          folder: folderPath,
          resourceType,
        })
          .then(async (sizes) => {
            assetCreated.sizes = sizes;
            await assetCreated.save();
            unlinkSync(file.path);
          })
          .catch((error) => console.log(error));
      }

      return this.formatDoc(assetCreated);
    }

    const assetCreated = await this[this.modelName].create({
      original,
      cloudinaryId,
      owner: userId,
    });

    return this.formatDoc(assetCreated);
  };
}

module.exports = AssetService;
