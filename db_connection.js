let mysql = require("mysql2")
let connection = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "root",
    database: "instashare"
  
  });
  
  function startConnection() {
    connection.connect((err) => {
      if (err) throw err;
      console.log("connected!")
    })
  }
 //save customers function 
async function savecustomers(email, username, password) {
  startConnection();
  let data = await connection.promise().query(
      `INSERT INTO customer (email, username, password) VALUES (?, ?, ?)`,
      [email, username, password]
  );
  return data[0];
}
 //check if  customers  is present or not
async function customerExists(email, username) {
  let [rows] = await connection.promise().query(
      `SELECT * FROM customer WHERE email = ? OR username = ?`,
      [email, username]
  );
  return rows.length > 0;
}
  //get customers function 
async function getcustomer() {
  startConnection();
  let data = await connection.promise().query("select * from customer");
  return data[0];

}
//get customer profilephoto in 
async function getphoto() {
  startConnection();
  let data = await connection.promise().query(`select  i.profileimg,i.custid ,c.username,c.id from customer as c
    join profile as i on c.id=i.custid ;
    `);
  return data[0];
}
// Function to get customer by email
async function getCustomerByEmail(email) {
  let [rows] = await connection.promise().query("SELECT * FROM customer WHERE email = ?", [email]);
  return rows[0];
}


//adding profilephoto
async function addProfile(custid, profileimg) {
  startConnection();
  const [rows] = await connection.promise().query(
      'SELECT * FROM profile WHERE custid = ?', [custid]
  );
  if (rows.length > 0) {
     
      const [updateResult] = await connection.promise().query(
          'UPDATE profile SET profileimg = ? WHERE custid = ?',
          [profileimg, custid]
      );
      return updateResult;
  } else {
     
      const [insertResult] = await connection.promise().query(
          'INSERT INTO profile (custid, profileimg) VALUES (?, ?)',
          [custid, profileimg]
      );
      return insertResult;
  }
}


//get profilephoto by ids
async function getprofilephoto(id) {
  startConnection();
  let data = await connection.promise().query(`select i.id, i.profileimg,i.custid from customer as c
    join profile as i on c.id=i.custid where i.custid=${id};
    `);
  return data[0];
}

//adding stories
async function addstories(userid,urstories) {
  startConnection();
  let data = await connection.promise().query(
    'INSERT INTO userstories (userid,urstories) VALUES (?, ?)', 
    [userid,urstories]
  );
  return data[0];
}

//get users stories
async function getusrstories(id) {
  const [data] = await connection.promise().query(
      `SELECT i.urstories, i.userid FROM customer AS c JOIN userstories AS i ON c.id = i.userid WHERE i.userid = ?`,
      [id]
  );
  return data;
}

//get  userposts
async function getcustompost(id) {
  startConnection();
  let data = await connection.promise().query(`select i.caption , i.image,i.customid,  c.username,c.email, c.id   from customer as c
    join posts as i on c.id=i.customid where i.customid=${id};
    `);
  return data[0];
}
//get  userstories
async function getcuststories(id) {
  startConnection();
  let data = await connection.promise().query(`select u.userid , u.urstories, c.username,c.email, c.id   from customer as c
    join userstories as u on c.id=u.userid where u.userid=${id};
    `);
  return data[0];
}
//get  userstories
async function getcustprofilepost(id) {
  startConnection();
  let data = await connection.promise().query(`select p.custid , p.profileimg, c.username,c.email, c.id   from customer as c
    join profile as p on c.id=p.custid where p.custid=${id};
    `);
  return data[0];
}
//adding posts
async function addPost(customid, image, caption) {
  startConnection();
  let data = await connection.promise().query(
    'INSERT INTO posts(customid, image, caption) VALUES (?, ?, ?)', 
    [customid, image, caption]
  );
  return data[0];
}
//get all customersposts
async function getallposts() {
  startConnection();
  let data = await connection.promise().query(`select i.caption, i.image,i.customid, pi.profileimg,  c.username,c.email, c.id   from customer as c
    join posts as i on c.id=i.customid join profile as pi on  c.id= pi.custid  ;
    `);
  return data[0];
}
async function getallstories() {
  startConnection();
  let data = await connection.promise().query(`select u.urstories , c.username,c.id  from customer as c
      join userstories as u on c.id = u.userid ;
    `);
  return data[0];
}

//get  customer with userid
async function getcustomerdata(id) {
  startConnection();
  const query = `select * from customer where id =${id};
  `;
  let [data] = await connection.promise().query(query);
  return data[0];
}

// function to delete  wishlist products by id
async function deleteprofilephoto(id) {
  startConnection();
  let sql = `DELETE FROM profile WHERE id = ?`;
  let data = await connection.promise().query(sql, [id]);
  return data[0];
}


//get  customer  photo with caption
async function getcaption(caption) {
   startConnection();
  const query = `
      SELECT i.caption, i.image, i.customid, c.username, c.email, c.id
      FROM customer AS c
      JOIN posts AS i ON c.id = i.customid
      WHERE i.caption = ?;
  `;
  let [data] = await connection.promise().query(query, [caption]);
  return data;
}

  module.exports = {
savecustomerdata:async(email, username, password)=>savecustomers(email, username, password),
customerExistsdata:async(email, username)=>customerExists(email, username),
getcustomerdata:async()=>getcustomer(),
getCustomerByEmaildata:async(email)=>getCustomerByEmail(email),
addProfiledata:async(custid,profileimg)=>addProfile(custid,profileimg),
addstoriesdata:async(userid,urstories)=>addstories(userid,urstories),
getprofilephotodata:async(id)=>getprofilephoto(id),
getusrstoriesdata:async(id)=>getusrstories(id),
postdata:async(customid,image,caption)=>addPost(customid,image,caption),
getallpostsdata:async()=>getallposts(),
getphotodata:async()=>getphoto(),
getallstoriesdata:async()=>getallstories(),
getcustompostdata:async(id)=>getcustompost(id),
getcustomerdataa:async(id)=>getcustomerdata(id),
getcuststoriesdataa:async(id)=>getcuststories(id),
getcustprofilepostdata:async(id)=>getcustprofilepost(id),
getcaptiondata:async(caption)=>getcaption(caption),
deleteprofilephotodata:async(id)=>deleteprofilephoto(id)
  }