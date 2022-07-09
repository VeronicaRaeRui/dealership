
exports.detail = (req, res) => {

    //check if logged in
    let loginStatus = req.session.loginStatus || false;

    //Vehicle vin
    let VIN = req.params.VIN || req.session.VIN ||false;

    //query to search vehicle detail in vehicle table
    let vehicleQuery = ` SELECT * FROM vehicle WHERE  VIN = '${VIN}'  `;

    db.query(vehicleQuery, (err, results) => 
    {
        if (err) {
            console.log(err);
            return res.send(err);
            //res.redirect('/');
        }
        //console.log(results[0]);
        if(results[0] == undefined)
        {
            res.render('detail.ejs', {noVehicleFound :true,
                loginStatus});
        }else{

        //vehicle type
        let type = results[0].vehicle_type;
        let detail = results[0];

        //query vehicle type table
        let typeQuery = ` SELECT * FROM ${type} WHERE  VIN = '${VIN}'; `;
        let salesQuery = `SELECT * FROM sells LEFT JOIN customer on sells.customer_id = customer.customer_id  WHERE VIN = '${VIN}'; `
        let serviceQuery = `SELECT *,  DATE_FORMAT(start_date , "%Y-%m-%d") as startdate,   DATE_FORMAT(completion_date ,"%Y-%m-%d") as completiondate FROM repair LEFT JOIN customer on REPAIR.customer_id = customer.customer_id WHERE VIN  = '${VIN}';`;
        let query = typeQuery + salesQuery + serviceQuery;
        db.query(query, (err, results) => 
        {
            if (err) {
                //console.log(err);
                return res.send(err);
                //res.redirect('/');
            }
            
            res.render('detail.ejs', {vehicle: detail,
                                        typeDetail: results[0][0],
                                        noVehicleFound :false,
                                        loginStatus,
                                        sales:results[1],
                                        services: results[2]
                                     })
        }) 

    }
    })
    
}