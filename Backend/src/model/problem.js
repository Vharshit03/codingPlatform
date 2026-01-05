const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: {
    type: String,
    enum: ["Arrays", "LinkedList", "Graph", "dp"],
    required: true,
  },
  visibleTestcase: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],
  hiddenTestcase: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  startCode: [
    {
      language: {
        type: String,
        required: true,
      },
      initialcode: {
        type: String,
        required: true,
      },
    },
  ],
  referenceSolution:[
    {
      language: {
        type: String,
        required: true,
      },
      completeCode: {
        type: String,
        required: true,
      },
    },
  ],
  problemCreator: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Problem = mongoose.model("problem", problemSchema);

module.exports = Problem;
