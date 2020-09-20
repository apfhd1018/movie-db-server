const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const examSchema = new Schema(
  {
    what: {
      type: String,
    },
    the: {
      type: String,
    },
    fuck: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema, "Exam");

module.exports = Exam;
