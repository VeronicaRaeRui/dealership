exports.salesPage = (req, res) => {

    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let VIN = req.params.VIN;
    let errorMessage = false;

    //query to search vehicle detail in vehicle table
    let vehicleQuery = ` SELECT * FROM vehicle WHERE  VIN = '${VIN}'  `;

    db.query(vehicleQuery, (err, results) => 
    {
        if (err) {
            console.log(err);
            return res.send(err);
            //res.redirect('/');
        }

        //detail is vehicle detail information
        let detail = results[0];

        res.render('sales.ejs', {vehicle: detail,
            loginStatus, errorMessage
         })
    })
}

exports.sales = (req, res) =>
{
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let VIN = req.params.VIN;

    let customerId = req.body.customerID
    let soldPrice = req.body.soldPrice
    let userName = req.session.user
    let today = new Date();
    let date = today.getFullYear() + '-' +today.getMonth() + '-' + today.getDate();

    let vehicleQuery = ` SELECT * FROM vehicle WHERE  VIN = '${VIN}';  `;

    //query to insert into sells table
    insertQuery = ` INSERT INTO Sells VALUES ('${userName}', '${VIN}', '${customerId}', '${soldPrice}', '${date}')   `;

    query = vehicleQuery + insertQuery; 
    db.query(query, (err, results) => 
    { 
        if (err) {

            vehicle = results[0][0];
            
            if(err.errno == 1452)
                {// errno: 1452 sqlMessage: 'Cannot add or update a child row: a foreign key constraint fails 
                //(`dealership_proj_db`.`sells`, CONSTRAINT `fk_Sells_customer_id_Customer_customer_id` FOREIGN KEY (`customer_id`) 
                //REFERENCES `customer` (`customer_id`))'
                // Customer number doesn't exist in the customer table. 
                    
                    errorMessage = 'No customer found, please check!'
                    res.render('sales.ejs',{errorMessage, loginStatus});
                    return;
                }
            else if(err.errno == 1062)
            {
                // errno: 1062
                // sqlMessage: "Duplicate entry '5BJ3ZR2EH6A861494' for key 'PRIMARY'"
                // there is already sales in the sells table, the vehicle has already been sold
                errorMessage = 'The vehicle has already been sold!'
                res.render('sales.ejs',{errorMessage, loginStatus});
                return;
            }
            else{
                console.log(err);
                return res.status(400).send(err);
            }

            
        }


        // add vehicle successfully, redirect to the detail page
        req.session.VIN = VIN;
        res.redirect('/detail/'+ VIN);
    })



}
