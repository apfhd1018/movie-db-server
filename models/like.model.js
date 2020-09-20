const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Favorite",
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema, "Like");

module.exports = Like;
