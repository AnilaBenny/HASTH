import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '../frameworks/database/schema/userSchema';
import { databaseSchema } from '../frameworks/database';

const passportConfig = () => {
  passport.use(new GoogleStrategy({
    clientID: '454780597057-m0hi77khg1hntm0l1qj2bm5as7qvbtng.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://hasth.mooo.com/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile); 
    
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      let user = await databaseSchema.User.findOne({ email:email});
      console.log(user);
      
      if (user) {
        return done(null, user);
      }
      
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error('No emails associated with this account'), undefined);
      }

      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      console.log(error);
      done(error, undefined);
    }
  }));

  passport.serializeUser((user: any, done) => {
    console.log('Serializing User:', user);
    done(null, user.id); 
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await databaseSchema.User.findById(id);
      console.log('Deserializing User:', user);
      done(null, user); 
    } catch (error) {
      done(error, null);
    }
  });
  
};

export default passportConfig;
