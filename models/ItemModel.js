import mongoose from 'mongoose'

const ItemSchema = mongoose.Schema({
    title: String,
    description: String,
    creator: String,
    state: {
        type: String,
        enum: ["need", "order", "work", "deliver", "done", "offer"]
    },
    keys: [String],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'requests'
    }],
    users: [String],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const ItemModel = mongoose.model('Items', ItemSchema)
export default ItemModel