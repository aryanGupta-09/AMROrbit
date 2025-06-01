import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        file_name: {
            type: String,
            required: false,
        },
        date: {
            type: String,
            required: false,
        },
        time: {
            type: String,
            required: false,
        },
        dataset: {
            type: Schema.Types.Mixed, // Use Mixed for arbitrary JSON
            required: false,
        },
        columns: {
            type: [String],
            required: false,
        },
        mapping_data: {
            type: Schema.Types.Mixed,
            required: false,
        },
        antibiotic_columns: {
            type: [String],
            required: false,
        },
        consent: {
            type: String,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;