let express = require("express");
let db_connction = require("./db_connection")
let cors = require("cors");
const formidable = require('express-formidable');
const nodemailer = require('nodemailer');
let app = express();

app.use(cors());

app.use(formidable());

app.listen(4002);


app.get("/employee", (req, res) => {
    res.write("express api");
    res.end();
})

//creating  post api for userdata

app.post("/savecustomer", async (req, res) => {
    const { email, username, password } = req.fields;
    try {
       
        if (await db_connction.customerExistsdata(email, username)) {
            return res.status(400).json({ error: "Email or Username already exists" });
        }
        await db_connction.savecustomerdata(email, username, password);
        res.status(201).json({ message: "Registration completed" });
    } catch (error) {
        console.error("There was an error registering!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/customers", async (req, res) => {
    let data = await db_connction.getcustomerdata();
    res.write(JSON.stringify(data));
    res.end();
})
app.get("/getphoto", async (req, res) => {
    let data = await db_connction.getphotodata();
    res.write(JSON.stringify(data));
    res.end();
})
app.post("/forgotpassword", async (req, res) => {
    const { email } = req.fields;
    try {
        let customer = await db_connction.getCustomerByEmaildata(email);
        if (customer) {
            // Send email (simplified, normally you wouldn't send plain passwords)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rajukuruma0927@gmail.com',
                    pass: 'sxiu sioq vcgj eooi'
                }
            });
            let mailOptions = {
                from: 'rajukuruma0927@gmail.com',
                to: email,
                subject: 'Your Password',
                text: `Your password is ${customer.password}`
            };
            await transporter.sendMail(mailOptions);
            res.json({ message: 'Password sent to your email.' });
        } else {
            res.status(404).json({ message: 'Email not found.' });
        }
    } catch (err) {
        console.error('Error during forgot password process:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});


app.post("/addprofile", async (req, res) => {
    const { custid, profileimg } = req.fields;
    try {
        await db_connction.addProfiledata(custid, profileimg);
        res.status(200).json({ message: "Profile image updated successfully" });
    } catch (error) {
        console.error("There was an error updating the profile image!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/addstories", async (req, res) => {
    const { userid,urstories } = req.fields;
    await db_connction.addstoriesdata( userid,urstories );
    res.end();
});


app.get("/getprophoto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getprofilephotodata(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})
app.get("/getstories/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getusrstoriesdata(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching stories data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/addposts", async (req, res) => {
    const { customid, image, caption } = req.fields;
    await db_connction.postdata(customid, image, caption);
    res.end();
});
app.get("/getallpost", async (req, res) => {
    let data = await db_connction.getallpostsdata();
    res.write(JSON.stringify(data));
    res.end();
})

app.get("/getallstories", async (req, res) => {
    let data = await db_connction.getallstoriesdata();
    res.write(JSON.stringify(data));
    res.end();
})

app.get("/getprofile/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getcustompostdata(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})
app.get("/getcustmstories/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getcuststoriesdataa(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})
app.get("/getcustmprofile/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getcustprofilepostdata(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})


app.get("/getprofiles/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let data = await db_connction.getcustomerdataa(id);
        res.json(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

//create delete wishlist iteam api
app.delete("/profile/del/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    await db_connction.deleteprofilephotodata(id);
    console.log("delete photo");
    res.end();
})

app.get('/getcaption/:caption', async (req, res) => {
    try {
        const caption = req.params.caption;
        const captionData = await db_connction.getcaptiondata(caption);
        res.json(captionData);
    } catch (error) {
        console.error('Error fetching caption data:', error);
        res.status(500).send('Server Error');
    }
});