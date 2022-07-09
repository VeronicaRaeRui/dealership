//login controller get
exports.login = (req, res)=>
{
    let username = false;
    let loginFailCheck = false;
    let message = '';
    let loginStatus = req.session.loginStatus || false;
    res.render('login.ejs', {loginFailCheck, message, username,loginStatus})
                
}

//login controller post
exports.loginAuthentication = (req, res)=>
{
    let username = req.body.username;
    let password = req.body.password;
    let loginFailCheck = false;
    let loginStatus = req.session.loginStatus || false;

    let loginQuery = "SELECT password FROM `user` WHERE  username = '" + username +"' "; 
    
    db.query(loginQuery, (err, results) => 
        {
            if (err) {
                return res.send(err);
                //res.redirect('/');
            }

            console.log(results[0].password)
            if(password === results[0].password)
            {
                req.session.user = username;
                req.session.loginStatus = true;
                return res.redirect('/search');
            }
            else{
                loginFailCheck = true;
                let message = 'Passwords did not match';
                username = false;
                res.render('login.ejs', { loginFailCheck, message, username, loginStatus})
            }
        }
    );                
}

//logout
exports.logout = (req, res)=>
{
    req.session.destroy( ()=>{
        console.log("user logged out.")
    });
     
    return res.redirect('/login');
}