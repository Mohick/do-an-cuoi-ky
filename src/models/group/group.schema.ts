import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name_project: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true,
            match: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/
        },
        public_image: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }
    ,
    members: {
        type: [String],
        required: true,
        default: []
    },
    status:{
        type: String,
        required: true,
        enum: ['đang hoạt động', 'đã hoàn thành', 'đã hủy'],
        default: 'đang hoạt động'
    }
}, {
    timestamps: true
});

const SchemaGroups = mongoose.model('Groups', groupSchema);
export default SchemaGroups;
