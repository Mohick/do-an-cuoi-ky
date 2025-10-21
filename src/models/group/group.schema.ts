import mongoose, { Schema } from 'mongoose';

const groupSchema = new Schema({
    projectName: { // Đổi thành camelCase cho nhất quán
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
            match: [/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/, 'Please fill a valid image URL']
        },
        public_id: {
            type: String,
            required: true
        }
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['leader', 'member', 'confirmer'],
            default: 'member'
        }
    }]
}, {
    timestamps: true
});
groupSchema.pre('save', function(next) {
    this.members.push({ user: this.creator, role: 'leader' });
    next();
});


const Group = mongoose.model('Group', groupSchema);
export default Group;