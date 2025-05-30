import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
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