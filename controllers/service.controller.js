exports.servicePage =(req, res) =>
{
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let VIN = req.params.VIN;
    let errorMessage = false || req.session.errorMessage ;
    

    //query to search vehicle detail in vehicle table
    vehicleQuery = ` SELECT * FROM vehicle WHERE  VIN = '${VIN}' ; `;
    serviceQuery = ` SELECT *,  DATE_FORMAT(start_date ,"%Y-%m-%d") as startdate FROM Repair WHERE VIN = '${VIN}' AND completion_date IS NULL;  `

    query = vehicleQuery + serviceQuery;
    
    db.query(query, (err, results) => 
    {

        if (err) {
            console.log(err);
            return res.send(err);
            
        }
        else if( results[0].length == 0)
        {
            // check if results[0] is empty, (the second query result ,vehicleQuery, is empty)
            // if so, redirect to vehicle search page
            res.redirect('/search');
            return;
        }

        //detail is vehicle detail information
        detail = results[0][0];
        // open service info
        

        
        if(results[1].length == 0)
        {
            // check if results[1] is empty, (the second query result ,service query, is empty), set session variable, this will effect how we query 
            // the database (INSERT OR UPDATE)
            // no open case, set startDate as today's date
            req.session.open = false;
            today = new Date();
            startDate = today.getFullYear() + '-' +today.getMonth() + '-' + today.getDate();
            service = [];
        }
        else{
            // open service info
            service = results[1][0];

            req.session.open = true;
            startDate = service.startdate;
            
        }
        req.session.startDate = startDate; 
        res.render('service.ejs', {vehicle: detail,
            loginStatus, errorMessage, service, startDate
         })
    })
}

exports.updateService = (req, res) =>
{
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let VIN = req.params.VIN;
    let errorMessage = false;
    let customerID = req.body.customerID;
    let odometerReading = req.body.odometerReading;
    let laborCharge = req.body.laborCharge;
    let description = req.body.description;
    let query = ``;
    let username = req.session.user;
    startDate = req.session.startDate;

    if(req.session.open==true)
    {
        // if there is open service, use UPDATE 
        query = ` UPDATE REPAIR SET customer_id = '${customerID}' , odometer_reading = '${odometerReading}' , labor_charge = '${laborCharge}',  repair_description = '${description}' WHERE VIN = '${VIN}' AND completion_date IS NULL; `;
    }
    else
    {
        // if there is no open service, INSERT a new one
        query = ` INSERT INTO REPAIR ( VIN, start_date, customer_id,username, repair_description, odometer_reading, labor_charge ) VALUES ('${VIN}', '${startDate}','${customerID}','${username}','${description}','${odometerReading}','${laborCharge}' ); `
    }

    db.query(query, (err, results) => 
    {
        console.log(query);
        console.log(err);
        console.log(results);
        if(err) 
        {
            if(err.errno == 1452)
            {
                // errno: 1452, sqlMessage: 'Cannot add or update a child row: a foreign key constraint fails (`dealership_proj_db`.`repair`, CONSTRAINT `fk_Repair_customer_id_Customer_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`))'
                // can't add the customer that doesn't exist in customer table
                req.session.errorMessage = 'Please check customer id';
                res.redirect('/service/' + VIN);
                return;
            }
        }

        res.redirect('/service/' + VIN);
    })

}

exports.finishService = (req, res) =>
{
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let VIN = req.params.VIN;
    let errorMessage = false;
    let customerID = req.body.customerID;
    let odometerReading = req.body.odometerReading;
    let laborCharge = req.body.laborCharge;
    let description = req.body.description;
    let query = ``;
    let username = req.session.user;
    today = new Date();
    endDate = today.getFullYear() + '-' +today.getMonth() + '-' + today.getDate();
    startDate = req.session.startDate;


    if(req.session.open==true)
    {
        query = ` UPDATE REPAIR SET customer_id = '${customerID}' , odometer_reading = '${odometerReading}' , labor_charge = '${laborCharge}',  repair_description = '${description}', completion_date = '${endDate}'  WHERE VIN = '${VIN}' AND start_date = '${startDate}'; ` ;

    }
    else
    {
        query = ` INSERT INTO REPAIR ( VIN, start_date, customer_id,username, repair_description, odometer_reading, labor_charge, completion_date ) VALUES ('${VIN}', '${startDate}','${customerID}','${username}','${description}','${odometerReading}','${laborCharge}', '${endDate}' ); `
    }

    db.query(query, (err, results) => 
    {


        if(err) 
        {
            
            if(err.errno == 1452)
            {
                // errno: 1452, sqlMessage: 'Cannot add or update a child row: a foreign key constraint fails (`dealership_proj_db`.`repair`, CONSTRAINT `fk_Repair_customer_id_Customer_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`))'
                // can't add the customer that doesn't exist in customer table
                req.session.errorMessage = 'Please check customer id';
                res.redirect('/service/' + VIN);
                return;
            }
            
        }
        res.redirect('/detail/' + VIN);

    })
}