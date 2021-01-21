import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
    const {
      body: { name, email, password, password2}  
    } = req;
    if(password !== password2){
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        try {
            const user = await User({
                name, email
            });
            await User.register(user, password);
            next();
        } catch(error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => 
    res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate('local', {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { 
        _json: { id, avatar_url: avatarUrl, name, email } 
    } = profile;
    try{
        const user = await User.findOne({email});
        if(user){
            user.githubId = id;
            user.avatarUrl = avatarUrl;
            user.name = name;
            //위와 같이 해준 이유는 최초 로그인 콜백 시 이름이 저장되어 있지
            //않은 경우에 깃헙에서 이름 추가를 해도
            //추후 로그인 시 이런 변경사항이 적용되지 않는 문제점이 있을 수
            //있다. 따라서 이렇게 해주는 것으로 보임.
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
    }catch(error){
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const googleLogin = passport.authenticate('google', { scope: ['profile'] });

export const googleLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const { 
        _json: { id, picture, name, email } 
    } = profile;
    try{
        const user = await User.findOne({email});
        if(user){
            user.githubId = id;
            user.avatarUrl = picture;
            user.name = name;
            //위와 같이 해준 이유는 최초 로그인 콜백 시 이름이 저장되어 있지
            //않은 경우에 깃헙에서 이름 추가를 해도
            //추후 로그인 시 이런 변경사항이 적용되지 않는 문제점이 있을 수
            //있다. 따라서 이렇게 해주는 것으로 보임.
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            picture
        });
        return cb(null, newUser);
    }catch(error){
        return cb(error);
    }
};

export const postGoogleLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};
    
export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "User detail", user: req.user });
};

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try{
        const user = await User.findById(id).populate('videos');
        console.log(user);
        res.render("userDetail", { pageTitle: "User detail", user });
    }catch(error){
        res.redirect(routes.home);
    }
}
    
export const getEditProfile = (req, res) => 
    res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
    const {
        body: { name, email},
        file
    } = req;
    try{
        await User.findByIdAndUpdate(req.user.id, {
            name, 
            email, 
            avatarUrl: file ? file.path : req.user.avatarUrl
        });
        res.redirect(routes.me);
    }catch(error){
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req, res) => 
    res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
    const {
        body: {oldPassword, newPassword, newPassword1}
    } = req;
    try{
        if(newPassword !== newPassword1){
            res.status(400);
            res.redirect(`/users/${routes.changePassword}`)
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    }catch(error){
        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
    }
};
