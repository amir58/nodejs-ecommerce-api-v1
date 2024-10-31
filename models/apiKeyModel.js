const mongoose = require( "mongoose" );

const apiKeySchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: [ true, "API key is required" ],
			unique: true,
			trim: true
		},
		name: {
			type: String,
			required: [ true, "API key name is required" ],
			trim: true
		},
		// userId: {
		// 	type: mongoose.Schema.ObjectId,
		// 	ref: "User",
		// 	required: [ true, "API key must belong to a user" ]
		// },
		isActive: {
			type: Boolean,
			default: true
		},
		lastUsed: {
			type: Date,
			default: null
		}
	},
	{
		timestamps: true
	}
);

// Index for faster queries
// apiKeySchema.index( { key: 1 } );
// apiKeySchema.index( { userId: 1 } );

const ApiKey = mongoose.model( "ApiKey", apiKeySchema );

module.exports = ApiKey;
