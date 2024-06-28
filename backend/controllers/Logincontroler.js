import User from "../models/user.js";

const CheckLogin = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let Getuser;
    let Checkpass;
    try {
        Getuser = await User.findOne({ username: username });
        Checkpass = await User.findOne({ username: username, password: password });
        console.log(Getuser);
        console.log(Checkpass);
        if (!Getuser) {
            return res.status(200).json(null);
        } else if (!Checkpass) {
            return res.status(200).json(false);
        } else {
            return res.status(200).json(true);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default CheckLogin;
