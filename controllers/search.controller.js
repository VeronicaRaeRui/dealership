const { count } = require('console');
const fs = require('fs');

exports.homeSearch = (req, res) => {


    //decodeURI decodes a Uniform Resource Identifier (URI) previously created by encodeURI() or by a similar routine.
    //%20 => space
    let VIN = req.query.VIN;
    let vehicle_type = req.query.vehicle_type;
    let Manufacturer = decodeURI(req.query.Manufacturer);
    let model_name = decodeURI(req.query.model_name);
    let model_year = req.query.model_year;
    let color = req.query.color;
    let price1 = req.query.price1;
    let price2 = req.query.price2;
    let keyword = req.query.keyword;
    let username = req.session.user;
    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    //for safety reason, only change status once logged in
    let status = loginStatus ? req.query.status :'unsold';
 

    //make_query, year_query and color_query retrive corresponding items from database for dynamic selection
    let make_query = " SELECT DISTINCT MANUFACTURER FROM Vehicle ORDER BY MANUFACTURER ASC ";

    let year_query = " SELECT DISTINCT model_year FROM Vehicle ORDER BY model_year DESC ";

    let color_query = " SELECT DISTINCT color FROM Vehicle ORDER BY color ASC ";

    let Query = " ";


    //check status. if choose all vehicle, then we retrieve data from vehicle table
    if (status == 'all')
    {//if all , then we retrieve data from vehicle table
        Query = " FROM `vehicle` WHERE  (1=1) ";
    }
    else if(status == 'sold')
    {//if sold, then we retrieve data in vehicle table and in sells table
        Query = " FROM `vehicle` WHERE  vehicle.VIN IN (SELECT VIN from sells) ";
    }else
    {//if unsold, then we retrieve data in vehicle table but not in sells table
        Query = " FROM `vehicle` WHERE  vehicle.VIN NOT IN (SELECT VIN from sells) ";
    } 

    if(VIN!=undefined && VIN!='' )
    {
        Query = Query + " AND ( VIN = '" + VIN +"' ) "; 
    }
    if(vehicle_type!=undefined && vehicle_type!='' )
    {
        Query = Query + " AND ( vehicle_type = '" + vehicle_type +"' ) "; 
    }
    if(Manufacturer!=undefined && Manufacturer!=''&& Manufacturer!='undefined')
    {
        Query = Query + " AND ( Manufacturer = '" + Manufacturer +"' ) "; 
    }
    if(model_name!=undefined && model_name!=''&& model_name!='undefined')
    {
        Query = Query + " AND ( model_name = '" + model_name +"' ) "; 
    }
    if(model_year!=undefined && model_year!= '')
    {
        Query = Query + " AND ( model_year = '" + model_year +"' ) "; 
    }
    if(color!=undefined && color!= '')
    {
        Query = Query + " AND ( color = '" + color +"' ) "; 
    }
    if(price1!=undefined && price1!='' )
    {
        Query = Query + " AND ( invoice_price >= " + price1 +" ) "; 
    }
    if(price2!=undefined && price2!='' )
    {
        Query = Query + " AND ( invoice_price <= " + price2 +" ) "; 
    }
    if(keyword!=undefined && keyword!='' )
    {
      
        Query = Query + " AND ( (1=1) ";
        keyword.split(" ").forEach((item, index)=>
        {

            item = db.escape(item);

            Query = Query + `AND (( vehicle_type LIKE ${item} ) `
            + ` OR ( Manufacturer LIKE ${item} ) `
            + ` OR ( model_name LIKE ${item} ) `
            + ` OR ( model_year LIKE ${item} ) `
            + ` OR ( style_body LIKE ${item} ) `
            + ` OR ( engine LIKE ${item} ) `
            + ` OR ( transmission LIKE ${item} ) `
            + ` OR ( trim LIKE ${item} ) `
            + ` OR ( drive_type LIKE ${item} ) `
            + ` OR ( color LIKE ${item} ) `
            + ` OR ( vehicle_description LIKE ${item} )) `
        }
        );

        Query = Query + ")";
        
    }

    //saerch query get vehicle info
    search_query = " SELECT * " + Query;

    //count query get number of records, for pagination
    count_query = "SELECT COUNT(*) AS vehicle_count " + Query;

 
    // execute query
    //db is defined in app.js as global.db = db
    db.query(count_query, (err, results) => 
        {
            if (err) {
                console.log(err);
                return res.send(err);
                //res.redirect('/');
            }
            

            //calculate number of records and total pages
            const resultsPerPage = 20; //display 20 records per page
            const numberOfRecords = results[0].vehicle_count;
            const numberOfPages = Math.ceil(numberOfRecords / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
        
            //adjust page: if page <1, adjust to page 1. if page > maximum page, adjust to last page
            page = page < 1 ? 1: page;
            page = page > numberOfPages ? numberOfPages : page;

            //Determine the SQL LIMIT starting number
            let startingLimit = (page - 1) * resultsPerPage > 0 ? (page - 1) * resultsPerPage : 0;

            
            //set iterator start and iterator end for pagination
            let iteratorStart = (page - 1) <=1 ? 1 : page - 1;
            let iteratorEnd = (page + 2) <= numberOfPages? page + 1: numberOfPages;
            
            //set search query
            searchQuery = " SELECT * " + Query + " LIMIT " +`${startingLimit} , ${resultsPerPage} `;

            //concatenate the queries together
            query = searchQuery + " ; "  + make_query + " ; " + year_query + " ; " + color_query + " ; "

            db.query(query, (err, results) => 
            {
                if (err) {
                    console.log(err);
                    return res.send(err);
                    //res.redirect('/');
                }
                
                res.render('index.ejs', 
                {
                title: "Welcome to XX dealership | View vehicle",
                vehicles: results[0],
                manuf: results[1],
                model_years : results[2],
                colors : results[3],
                page, iteratorStart, iteratorEnd, numberOfPages,numberOfRecords,
                vehicle_type, Manufacturer, model_name, model_year,
                price1,price2,keyword, username, loginStatus, color, status
                })
            })
        }
    )
}

//ajax, change model name based on selected make. It is used in both serach vehicle page and add
// vehicle page
exports.ajax = (req, res)=>
{
    let make = req.query.Manufacturer;
    //compose the query
    let model_query = "SELECT DISTINCT model_name FROM vehicle WHERE manufacturer = '" + make +"'";
    
    console.log(model_query);

    db.query(model_query,function(err,result)
    {
        if(err) 
        { return res.send(err); }
        res.send(result);
    })
}