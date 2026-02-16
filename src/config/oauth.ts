import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { userRepository } from '../repository/user.repository';
import { ifError } from 'node:assert';
import prisma from '../prisma/prisma';
import { User } from '@prisma/client';

passport.use(
    new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const fullName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email from Google'), undefined);
        }

        // 1. Cek apakah user sudah ada via googleId
        let user = await userRepository.findByGoogleId(googleId);

        if (user) {
          // User sudah pernah login dengan Google
          return done(null, user);
        }

        // 2. Cek apakah email sudah terdaftar (via email/password)
        user = await userRepository.findByEmail(email);

        if (user) {
          // Email sudah ada, hubungkan dengan Google account
          user = await userRepository.connectGoogleAccount(
            user.id,
            googleId,
            avatarUrl
          );
          return done(null, user);
        }

        // 3. User baru, buat akun baru
        user = await userRepository.createData({
          email,
          fullName,
          googleId,
          avatarUrl,
          authProvider: 'GOOGLE',
          isVerifiedEmail: true, // Google sudah verifikasi email
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!,
        },
        async(payload, done) =>{
            try{
                const user = await userRepository.findById(payload.userId)

                if(!user){
                    return done(null, false)
                }

                return done(null, user)

            } catch (error){
                return done(error, false)
            }
        }
    )
)

export default passport;
