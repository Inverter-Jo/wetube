import express from "express";
import passport from "passport";
import routes from "../routes";
import { getJoin, getLogin, getMe, githubLogin, googleLogin, logout, postGithubLogin, postGoogleLogin, postJoin, postLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);
//post로 비번이랑 아이디를 보내주고 몽구스 플러그인이 자동으로 체크인 한다.
//그 후 passport에게 비번이 맞다면 맞다고 알려주고 passport는 쿠키를 생성한다.
//쿠키는 세션의 아이디를 가지고 있어 백엔드에 있는 민감정보들과 연동해 정보를 확인
//로그인을 시키거나 회원가입을 할 수 있으며, 로그인 상태를 유지할 수 있다.

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.gitHub, githubLogin);

globalRouter.get(
    routes.githubCallback, 
    passport.authenticate('github', { failureRedirect: '/login' }),
    postGithubLogin
);

globalRouter.get(routes.google, googleLogin);

globalRouter.get(
    routes.googleCallback, 
    passport.authenticate('google', { failureRedirect: '/login' }),
    postGoogleLogin
);

globalRouter.get(routes.me, getMe);

//githup 인증은 약간 다른데 먼저 로그인이나 회원가입 버튼을 누르게 되면
//사용자는 깃헙 웹사이트로 이동하게 된다. 여기에서 auth(권한승인)을 하게 된다.
//그 후 웹사이트는 그 사용자의 정보를 우리에게 보내게 된다.
//그 주소는 auth/github/callback 으로 passport에 저장된 함수가 호출 된다.
//호출된 함수인 githubLoginCallback는 사용자의 profile과 같은 모든 정보를
//받는다. 이 정보로 email로 사용자 찾기, github ID로 사용자 찾기 등의 기능을
//수행할 수 있게 되는 것이다. 단, 위 함수의 주어진 한 가지 조건은 
//바로 callback(cb)함수를 return해야 한다는 것으로 cb함수를 실행시켜야 한다.
//그리고 그 함수에 error가 있는지 user가 있는지를 알려주어서(cb(null, user))
//error가 존재 한다면 bye!, but user가 있다면 이를 취해 쿠키를 만들고(make)
//저장하고(save) 브라우저에 이 쿠키를 보내게(send) 된다.
//router(routes.github)->githublogin->auth->callback->passport->
//user를 찾으면->postGithubLogin이 실행 후 home으로 redirect->
//쿠키를 만들어 유저 정보를 저장
//cb(error)가 return 시 passport는 error가 있음을 인식하고 /login 화면으로
//보내버린다.

export default globalRouter;