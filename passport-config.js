const { authenticate } = require('passport')

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, pass, done ) => {
        const user = getUserByEmail(email)
        if(user == null){
            return done(null, false, { message: 'Такого користувача не існує' })
        }
        try{
            if(await bcrypt.compare(pass, user.pass)){
                return done(null, user)
            } else{
                return done(null, false, {message: 'Невірний пароль'})
            }
        } catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done) => {done(null, user.id)})
    passport.deserializeUser((id,done) => {
        done(null, getUserById(id))
    })
}
module.exports = initialize