const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    movieId: {
      type: String,
    },
    movieTitle: {
      type: String,
    },
    moviePoster: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
