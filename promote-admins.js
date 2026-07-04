const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function demoteUsers() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected!");

        const UserSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Demote other users back to "user" role
        const demoteResult = await User.updateMany(
            { email: { $in: ["aimedmy@gmail.com", "ai.reaz.all@gmail.com", "reaz4524@gmail.com"] } },
            { $set: { role: "user" } }
        );
        console.log("Demoted other users to user role:", demoteResult);

        // Ensure admin@FindtionTravel.com is "admin"
        const promoteResult = await User.updateMany(
            { email: { $in: ["admin@FindtionTravel.com", "admin@findtiontravel.com"] } },
            { $set: { role: "admin" } }
        );
        console.log("Promoted admin to admin role:", promoteResult);

        process.exit(0);
    } catch (error) {
        console.error("Failed to update user roles:", error);
        process.exit(1);
    }
}

demoteUsers();
