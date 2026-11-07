
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Submission", submissionSchema);