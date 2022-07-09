const { count } = require('console');
const fs = require('fs');

exports.customerSearchPage = (req, res)=> {

    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let customerId = req.session.customerId || false;
    let customers = [];
    let methodPost = false;
    deleteErrorMessage = false;

    //redirct from addCustomer page after successfully adding the new customer
    //store the customer ID in the session and query based on customer id
    if(customerId != false)
    {
        customerQuery = ` SELECT * FROM customer WHERE customer_id = '${customerId}' `;
        db.query(customerQuery, (err, results) => 
        {
            if (err) {
                console.log(err);
                return res.send(err);
            }

            customers = results

            res.render('searchCustomer.ejs', {loginStatus,customers, methodPost, deleteErrorMessage})
        }) 

    }
    //if customer id is false, then just load the page
    else
    {
        res.render('searchCustomer.ejs', {loginStatus, customers, methodPost, deleteErrorMessage})
    }
    

    


}


exports.customerSearch = (req, res) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;
    let email = req.body.email;
    let company = req.body.company;
    deleteErrorMessage = false;
    
    //check if logged in
    let loginStatus = req.session.loginStatus || false;

    let methodPost =  true;
    //remove customerid in the session
    req.session.customerId = false;

    let customerQuery = ``;
    
    
   

    //query to search vehicle detail in vehicle table
    customerQuery = ` SELECT * FROM customer WHERE 0=1 `;

    if(firstName != '' &&  lastName != '')
    {
        customerQuery = customerQuery + ` or ( first_name = '${firstName}' AND last_name = '${lastName}' )   `
    }
    else if(lastName != '' )
    {
        customerQuery = customerQuery + ` or last_name = '${lastName}' `
    }
    else if(firstName != '' )
    {
        customerQuery = customerQuery + ` or first_name = '${firstName}' `
    }
    if(phone != '' )
    {
        customerQuery = customerQuery + ` or phone = '${phone}' `
    }
    if(email != '' )
    {
        customerQuery = customerQuery + ` or email = '${email}' `
    }
    if(company != '' )
    {
        customerQuery = customerQuery + ` or company = '${company}' `
    }

    
    db.query(customerQuery, (err, results) => 
        {
            if (err) {
                console.log(err);
                return res.send(err);
                //res.redirect('/');
            }

            customers = results

            res.render('searchCustomer.ejs', {loginStatus,customers, methodPost})
        }) 
 
 

    
}

exports.customerDetail = (req, res) =>{

    //Vehicle vin
    let email = req.query.email || req.session.email || false;
    let customerId = req.params.customer_id;
    //check if logged in
    let loginStatus = req.session.loginStatus || false;


    //query to search vehicle detail in vehicle table
    let customerQuery = ` SELECT * FROM customer WHERE customer_id = '${customerId}';  `;
    let salesQuery = ` SELECT *,  DATE_FORMAT(sold_date ,"%m %d %Y") as solddate FROM sells LEFT JOIN Vehicle on sells.VIN = Vehicle.VIN WHERE customer_id = '${customerId}'; `;
    let serviceQuery  = `SELECT *,  DATE_FORMAT(start_date ,"%m %d %Y") as startdate,   DATE_FORMAT(completion_date ,"%m %d %Y") as completiondate FROM repair LEFT JOIN Vehicle on REPAIR.VIN = Vehicle.VIN WHERE customer_id = '${customerId}';`;

    let query = customerQuery + salesQuery + serviceQuery;
    db.query(query, (err, results) => 
    {
        if (err) {
            console.log(err);
            return res.send(err);
            //res.redirect('/');
        }

        else{
            customers = results[0];
            vehicles = results[1];
            services = results[2];
            res.render('customerDetail.ejs', {customers, vehicles,services, loginStatus});
        }

    })
}