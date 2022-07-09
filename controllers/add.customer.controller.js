

exports.addCustomerPage = (req, res) => {

    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let duplicateEmail = false;

    res.render('addCustomer.ejs',{loginStatus, duplicateEmail});
}

exports.addCustomer = (req, res) => {

    //decodeURI decodes a Uniform Resource Identifier (URI) previously created by encodeURI() or by a similar routine.
    //%20 => space
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;
    let email = req.body.email;
    let company = req.body.company;
    let street = req.body.street;
    let apt_suite = req.body.apt_suite;
    let city = req.body.city;
    let state = req.body.state;
    let zip_code = req.body.zip_code;
    let note = req.body.note;
    let duplicateEmail = false;
    
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    
    //insert query
    let queryField = `INSERT INTO customer ( first_name, last_name, phone, 
        email, street, apt_suite, city, state, zip_code `;
    let queryValue = ` VALUES ('${firstName}','${lastName}','${phone}','${email}',
    '${street}','${apt_suite}','${city}','${state}','${zip_code}' `;

    // check optional fields
    if(company != '' )
    {
        queryField = queryField + `, company `;
        queryValue = queryValue + `, '${company}'`;
    }

    if(note != '' )
    {
        queryField = queryField + `, note `;
        queryValue = queryValue + `, '${note}'`;
    }

    let addCustomerQuery = queryField + ` ) ` + queryValue + ` ) `;
    
    db.query(addCustomerQuery, (err, results) => 
        {
            if (err) {
                console.log(err);
                if(err.errno == 1062)
                {
                    duplicateEmail = true;
                    res.render('addCustomer.ejs',{loginStatus, duplicateEmail});
                }
            }
            else
            {
            
                insertId = results.insertId
            
                res.redirect('/customerDetail/'+insertId);
            }
        }) 
}

exports.editCustomerPage = (req, res) =>
{
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let customerId = req.params.customer_id;
    let duplicateEmail = false;

    customerQuery = ` SELECT * FROM customer WHERE customer_id = '${customerId}' `;
    db.query(customerQuery, (err, results) => 
    {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        customer = results[0];
        res.render('editCustomer.ejs', {loginStatus,customer, duplicateEmail})
    })   
}

exports.editCustomer = (req, res) =>
{
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;
    let email = req.body.email;
    let company = req.body.company;
    let street = req.body.street;
    let apt_suite = req.body.apt_suite;
    let city = req.body.city;
    let state = req.body.state;
    let zip_code = req.body.zip_code;
    let note = req.body.note;
    let duplicateEmail = false;
    let customerId = req.params.customer_id;

    //check if logged in
    let loginStatus = req.session.loginStatus || false;

    //insert query
    let updateQuery = `UPDATE customer SET first_name = '${firstName}', last_name ='${lastName}', phone='${phone}', email= '${email}', street= '${street}', city= '${city}', state = '${state}', zip_code ='${zip_code}'`;

    // check optional fields
    if(company != '' )
    {
        updateQuery = updateQuery + `, company='${company}'`;
    }

    if(note != '' )
    {
        updateQuery = updateQuery + `, note='${note}'`;
    }

    if(apt_suite != '' )
    {
        updateQuery = updateQuery + `, apt_suite='${apt_suite}'`;
    }
    
    updateQuery = updateQuery +` where customer_id = ${customerId} `

    db.query(updateQuery, (err, results) => 
        {
            if (err) {
                console.log(err);
                // error no: 1062, duplicate primary key
                if(err.errno == 1062)
                {
                    duplicateEmail = true;
                    console.log('render w/o customer detail?');
                    res.render('editCustomer.ejs',{loginStatus, duplicateEmail});
                }
                else{
                    return res.send(err);
                }
            }
            else
            {
                req.session.email = email;
            
                res.redirect('/customerDetail/'+customerId);
            }
        }) 

}


exports.deleteCustomer = (req, res) =>
{
    let customerId = req.params.customer_id;
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let customers = [];
    let methodPost = false;
    let deleteErrorMessage = false;

    let deleteUserQuery = `DELETE FROM customer WHERE customer_id = '${customerId}'`;

    db.query( deleteUserQuery, (err, results)=>
    {
        if (err) {
            if(err.errno == 1451)
            {
                // errno: 1451 sqlMessage: Cannot delete or update a parent row: a foreign key constraint fails 
                // (`dealership_proj_db`.`sells`, CONSTRAINT `fk_Sells_customer_id_Customer_customer_id` 
                // FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`))
                // user has records in sells table, can't be deleted

                deleteErrorMessage = "can't delete customer " + customerId +". The customer has sales record";
                res.render('searchCustomer.ejs', {loginStatus, customers, methodPost, deleteErrorMessage} )
            }
            else
            {
                return res.status(500).send(err);
            }
            
        }

        else
        {
            res.redirect('/searchCustomer');

        }
    })
}