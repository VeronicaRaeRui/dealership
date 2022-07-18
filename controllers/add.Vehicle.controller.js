const fs = require('fs');

exports.addVehiclePage = (req, res) => {

    //check if logged in
    let loginStatus = req.session.loginStatus || false;
    let message = req.session.message || false;

    //make_query, year_query, color_query, type_query retrive corresponding items from database for dynamic selection
    let make_query = " SELECT DISTINCT MANUFACTURER FROM Vehicle ORDER BY MANUFACTURER ASC ";

    let color_query = " SELECT DISTINCT color FROM Vehicle ORDER BY color ASC ";

    let type_query = " SELECT DISTINCT vehicle_type FROM Vehicle ORDER BY color ASC ";

    // concatenate the queries togetger

    let query = make_query + " ; " + color_query+ " ; " + type_query;

    db.query(query, (err, results)=>
    {
        if (err) {
            console.log(err);
            return res.send(err);
            //res.redirect('/');
        }

        res.render('addVehicle.ejs',
        { loginStatus, 
        message,
        manuf:results[0],
        colors:results[1],
        types:results[2]
        });

    })

    
}


exports.addVehicle = (req, res)=>
{
    
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    // get vehicle information

    let username = req.session.user;
    let vin = req.body.vin;
    let make = req.body.make;
    let model_name = req.body.model_name;
    let model_year = req.body.model_year;
    let style = req.body.style;
    let engine = req.body.engine;
    let vehicle_type = req.body.vehicle_type;
    let transmission = req.body.transmission;
    let trim = req.body.trim;
    let drive_type = req.body.drive_type;
    let color = req.body.color;
    let seats = req.body.seats;
    let odormeter = req.body.odormeter;
    let price = req.body.price;
    let vehicle_description = req.body.vehicle_description
    let uploadedFile = req.files.image;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    let image_name = vin+'.' +fileExtension;
    // get date
    let today = new Date();
    let date = today.getFullYear() + '-' +today.getMonth() + '-' + today.getDate();
    
    let addVehicleQuery = `INSERT INTO vehicle ( VIN, username, invoice_price, manufacturer, vehicle_type, model_name,
        model_year, style_body, engine, transmission, odermeter_reading, trim, drive_type, seats, color, 
        vehicle_description, added_date, vehicle_image ) VALUES ( '${vin}','${username}','${price}','${make}','${vehicle_type}','${model_name}','${model_year}','${style}','${engine}',
        '${transmission}','${odormeter}','${trim}','${drive_type}','${seats}','${color}','${vehicle_description}','${date}','${image_name}' )`;

        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }
            })
        }
        else{
            req.session.message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.redirect('/addVehicle');
            return;
        }

        db.query(addVehicleQuery, (err, results) => 
        {
            if (err) {
                console.log(err);
                //error 1062: duplicate primary key
                if(err.errno == 1062)
                {
                    //set duplicateVin = ture, redirect to addVehicle using GET
                    req.session.message = "duplicate VIN number.";;
                    res.redirect('/addVehicle');
                }
                else{
                    return res.status(500).send(err);
                }   
            }

            else
            {
                //add vehicle successfully, redirect to vehicle detail page
                console.log(results);
                res.redirect('/detail/'+vin);
            }
        }) 

    
}
