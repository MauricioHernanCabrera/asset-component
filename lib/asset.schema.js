const { Schema } = require("mongoose");
const { ObjectId } = Schema.Types;

const AssetSize = Schema(
  {
    size: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const AssetSchema = Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Users",
      required: true,
    },

    original: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    sizes: [
      {
        type: AssetSize,
        default: [],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = AssetSchema;
