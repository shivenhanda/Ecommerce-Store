import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose'
import { NewUser } from './Model';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://ecommerce-store-f5y1.vercel.app/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
        if(mongoose.connection.readyState!==1){
            try{
            await mongoose.connect(process.env.MongoDB_URI)
            }
            catch(error){
                console.log(error)
            }
        }
        let user=await NewUser.find({email:profile.email[0].value})
        if(!user){
            user=await NewUser.create({
                user:profile.displayName,
                email:profile.email[0].value,
                avatar:profile.photos?.[0]?.value
            })
        }
        done(null,user)
    }
    catch(err){
        done(err,null)
    }
  }
));