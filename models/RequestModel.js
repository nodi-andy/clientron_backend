import mongoose from 'mongoose'

const RequestSchema = mongoose.Schema({
    title: String,
    description: String,
    creator: String,
    state: {
        type: String,
        enum: ["open", "accepted", "declined", "removed", "done"]
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const RequestModel = mongoose.model('requests', RequestSchema)
export default RequestModel