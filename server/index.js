const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const connection = require("./connection");

const dbConnection = () => {
  try {
    connection.connect();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

dbConnection();

// GET USERS
app.get("/getusers/", (req, res) => {
  connection.query("SELECT * FROM user_details", (error, results) => {
    if (error) {
      res.status(400);
      res.send(error);
    } else {
      res.send(results);
    }
  });
});

// CREATE USER
app.post("/createuser/", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);
  connection.query(
    "INSERT INTO user_details(username, password) values(?,?)",
    [username, hashedPassword],
    (error, results) => {
      if (error) {
        res.status(400);
        res.send(error);
      } else {
        // connection.query("SELECT * FROM user_details", (error, results) => {
        //   if (error) {
        //     res.status(500);
        //     res.send(error);
        //   } else {
        //     res.send(results);
        //   }
        // });
        // res.status(200);
        res.send(results);
      }
    }
  );
});

// UPDATE USER
app.patch("/updateuser/:username/", (req, res) => {
  const { username } = req.params;
  const { firstname, email, mobile } = req.body;

  connection.query(
    "UPDATE user_details SET first_name=?, email=?, mobile=? WHERE username=?",
    [firstname, email, mobile, username],
    (error, results) => {
      if (error) {
        res.status(400);
        res.send(error);
      } else {
        res.send(results);
      }
    }
  );
});

// UPDATE PASSWORD
app.patch("/changepassword/:username/", (req, res) => {
  const { username } = req.params;
  const { oldPassword, password } = req.body;
  connection.query(
    "SELECT * FROM user_details WHERE username=?",
    [username],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      if (results.length === 0) {
        res.status(404).send("User not found");
        return;
      }
      const oldHashedPassword = results[0].password;
      bcrypt.compare(oldPassword, oldHashedPassword, async (err, result) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send("An error occurred while changing the password.");
          return;
        }
        if (!result) {
          res.status(401).send("The old password is incorrect.");
          return;
        }
        const newHashedPassword = await bcrypt.hash(password, 10);
        connection.query(
          "UPDATE user_details SET password=? WHERE username=?",
          [newHashedPassword, username],
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .send("An error occurred while changing the password.");
            } else {
              // console.log(result);
              res.send("Password changed successfully.");
            }
          }
        );
      });
    }
  );
});

// LOGIN
app.post("/login/", (req, res) => {
  const { username, password } = req.body;
  connection.query(
    "SELECT * FROM user_details WHERE username=?",
    [username],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      if (results.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
      }
      const storedPassword = results[0].password;
      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          res.status(500).send("An error occurred while verifying password");
          return;
        }
        if (!result) {
          res.status(401).send("Invalid Password");
          return;
        }
        res.send("Login successful!");
      });
    }
  );
});

// ADD NEW ITEM
app.post("/createitem/", (req, res) => {
  const { category, title, image_url, brand, price } = req.body;

  connection.query(
    "INSERT INTO products(title, brand, category, price, image_url) VALUES(?,?,?,?,?)",
    [title, brand, category, price, image_url],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send("Product successfully added");
    }
  );
});

// CREATE NEW ORDER
app.post("/createorder/", (req, res) => {
  const {
    id,
    category,
    item,
    firstname,
    lastname,
    email,
    mobile_no,
    address,
    pincode,
    state,
  } = req.body;

  connection.query(
    "INSERT INTO orders(id, category, item, firstname, lastname, email, mobile_no, address, pincode, state) VALUES(?,?,?,?,?,?,?,?,?,?)",
    [
      id,
      category,
      item,
      firstname,
      lastname,
      email,
      mobile_no,
      address,
      pincode,
      state,
    ],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send("Order successfully created");
    }
  );
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
