import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/default.jpg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    } 
},
{timestamps: true }
);

userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) return;

    const salt =  randomBytes(16).toString(); // -> For every user create a 16bit random secret key
    const hashedPassword = createHmac("sha256", salt) // -> Using salt, hash(encrypt) password  
        .update(user.password)
        .digest("hex");

    this.salt = salt; // -> update
    this.password = hashedPassword; // -> update
    
    next();
});

userSchema.static("matchPassword", async function( email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error(`User not found!`);

    const salt = user.salt;
    const  hashedPassword = user.password;

    const  userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if( hashedPassword !== userProvidedHash) throw new Error(`Incorect Password`);

    return user;
});

const User = model("user", userSchema);

export { User };