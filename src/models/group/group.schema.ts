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
            match: [/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/, 'Please fill a valid image URL']
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
        },
        joined: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});
groupSchema.pre('save', function (next) {
    if (this.members.length) {
        next()
        return
    };
    this.members.push({ user: this.creator, role: 'leader', joined: true });
    next();
});


const Group = mongoose.model('Group', groupSchema);
export default Group;