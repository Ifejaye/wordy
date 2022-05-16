const { User } = require('../models/user');
const  bcrypt = require('bcrypt');


// To get our signin page

const get_signin = (req,res)=>{
    res.render('signin')
}

//To get the signup page
const get_signup = (req,res)=>{
    console.log(req.session);
    req.session.save(()=>{
        console.log('done');
    })
    res.render('signup')
}

// To sumbmit our sign in page
const submit_login = async(req,res)=>{
    const {email, password} = req.body;
    console.log(req.body);
    console.log(password);

    let user =  await User.findOne({email}) 
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        
            console.log(validPassword);
            if (email == user.email && validPassword) {
                // This is where express session takes over to help me save my session

                req.session.regenerate(function (err) {
                    if (err) next(err)
                
                    // store user information in session, typically a user id
                    console.log(req.body);
                    req.session.user =user.username
                
                    console.log(req.session);
                    req.session.save(function (err) {
                      if (err) 
                      return console.log(err)
                      res.redirect('/')
                    })
                  })

                // Express session should have saved my session by now
            } else {
                res.redirect('/signin')
            }   
    } else {
        res.redirect('/signup')
    } 
}


//  To submit details for sign up, that is, to create new user
const create_new_user = async(req,res)=>{
    const {username, email, password} = req.body;
    console.log(req.body);
    let user =  User.findOne({ email })
    try {
        if (user){
            try {
                const saltRounds = 10;
                const {username, email, password} = req.body;
    
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password,salt)
                
                // newUser = new User({username, email, hash});
                const newUser = new User({
                   username: username,
                   email: email,
                   password: hashedPassword, 
                });
                result = await newUser.save();
                console.log('saved');
                res.redirect('/signin');
                 }
            catch{
                console.log("trial failed");
                console.log(error);
                 }
        }else{
            res.redirect('/about');
        }
    } catch (error) {
       console.log('error'); 
    }
}

module.exports = {
    get_signin,
    get_signup,
    submit_login,
    create_new_user
}