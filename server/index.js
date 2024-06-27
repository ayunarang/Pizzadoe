const path = require('path')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDb = require('./db.js');
const User = require('./models/User.js');
const InventoryItem = require('./models/Inventory.js');
const OTP = require('./models/OTP.js')
const EmailContent = require('./mail_template/send_otp.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const NewOrders = require('./models/NewOrders.js');
const { body, validationResult } = require('express-validator');


const sendEmailNotificationForotp = (message) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.user,
      pass: process.env.password,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN,
    to: process.env.ADMIN,
    subject: 'Forgot Password OTP',
    html: message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoDb();



var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret:  process.env.RAZORPAY_SECRET,
});


app.get('/api/getUserEmail/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  const email = user.email;
  res.status(200).json({ success: true, email: email });

})

app.post('/api/changepassword/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user_given_password = req.body.user_entered_old_password;
  const new_password = req.body.user_entered_new_password;
  try {
    const user = await User.findById(userId);
    const password = user.password;

    let comparepassword = await bcrypt.compare(user_given_password, password);

    if (comparepassword) {
      const salt = await bcrypt.genSalt(10);
      let securepassword = await bcrypt.hash(new_password, salt);
      user.password = securepassword;
      console.log("password changed");
      await user.save();
      res.status(200).json({ message: "Password changed" })
    } else {
      res.status(200).json({ message: "Incorrect old password" })
    }
  }
  catch (error) {
    console.log(error);
  }

});

app.get('/api/checkout/key', async (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/checkout', async (req, res) => {
  try {
    const options = {
      amount: 100,
      currency: "INR",

    };
    const order = await instance.orders.create(options);
    res.status(200).json({ order });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/checkout/paymentVerification/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const cartItems = user.cartItem;
    console.log(cartItems);

    const placedorders = user.PlacedOrders;
    // //send for saving in database
    placedorders.push(cartItems);
    user.cartItem = [];


    //user info
    const olduser = await NewOrders.findOne({ customer_id: userId });
    if (!olduser) {
      const customer_id = userId;
      const name = user.name;
      const email = user.email;
      const location = user.location;
      const saveUserInDb = new NewOrders({
        customer_id: customer_id,
        name: name,
        email: email,
        location: location,
        Order: [cartItems],
      });

      await saveUserInDb.save();
    } else {
      olduser.Order.push(cartItems);
      await olduser.save();
    }

    await InventoryItem.updateMany({}, { $inc: { quantity: -1 } });
    await user.save();

    const threshold = 20;
    const inventoryItems = await InventoryItem.find();
    await Promise.all(
      inventoryItems.map(async (item) => {
        if (item.quantity < threshold) {
          await sendEmailNotification('Low Stock Alert', `${item.name} is running low on stock. (ID: ${item._id})`);
        }
      })
    );
    console.log('email send');
    res.redirect("http://localhost:3000/orders");

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const orders = user.PlacedOrders.flat();

  res.json({ Orders: orders });
});


app.post("/api/createuser", [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('name')
    .notEmpty().withMessage('Name is required'),

  body('location')
    .notEmpty().withMessage('Location is required'),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a JSON response with details about the validation errors
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {


      const salt = await bcrypt.genSalt(10);
      let securepassword = await bcrypt.hash(req.body.password, salt);

      const saveUserInDb = new User({
        name: req.body.name,
        email: req.body.email,
        password: securepassword,
        location: req.body.location,
        cartItems: [],
        PlacedOrders: [],
      });

      await saveUserInDb.save();
      const usercredentials = saveUserInDb._id;

      const data = {
        user: {
          id: usercredentials
        }}
        const userId = data.user.id.toString();
  
      const authtoken = jwt.sign(data, process.env.jwtSecret);
      res.json({ success: true , authtoken: authtoken, userId: userId , Role: "user"});
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  });

app.post("/api/loginuser", async (req, res) => {
  try {
    console.log('Request body:', req.body);

    let email = req.body.email;
    let password = req.body.password;

    let usercredentials = await User.findOne({ email });

    if (!usercredentials) {
      return res.json({ success: false, message: "Try signing in first" });
    }

    let comparepassword = await bcrypt.compare(password, usercredentials.password);

    if (!comparepassword) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const data = {
      user: {
        id: usercredentials._id
      }  
    };
    const userId = data.user.id.toString();
    const user = await User.findById(userId);
    const role= user.role;

    
    const authtoken = jwt.sign(data, process.env.jwtSecret);
    res.json({ success: true, authtoken: authtoken, userId: userId , Role: role});
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

app.post('/api/foodData', (req, res) => {
  try {
    console.log('Received a POST request to /api/foodData');
    res.json([global.pizzaCategory]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/AdminData', (req, res) => {
  try {
    console.log('Received a POST request to /api/AdminData');
    res.json([global.admin_items]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post(`/api/add-to-cart/:userId`, async (req, res) => {

  if (req.params.userId == "null") {
    return res.status(400).json({ error: 'User not found' });
  }

  const userId = req.params.userId;

  const { id, name, price, qty, size, img } = req.body;

  try {

    const newItem = { id, name, price, qty, size, img };

    const user = await User.findById(userId);

    const existingItem = user.cartItem.find(item => item.id === id && item.size === size && item.qty === qty);

    if (existingItem) {

      return res.status(400).json({ error: 'Item already in cart' });
    }

    const itemWithSameSize = user.cartItem.find(item => item.id === id && item.size === size);

    if (itemWithSameSize) {
      return res.status(400).json({ error: 'Item already in cart. Please select different size option' });
    }

    res.status(200).json({ message: 'Item added to cart' });
    user.cartItem.push(newItem);


    await user.save();
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


});

app.get('/api/cart/items/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  const cartItems = user.cartItem;

  res.json(cartItems);
});

app.post('/api/stock/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await InventoryItem.findById(itemId);
    item.quantity += 10;
    await item.save();
    res.status(200).json({ message: 'Stock updated successfully', item });
  }
  catch (error) {
    res.status(500).json({ error: 'Server error' });
  }

});

app.get('/api/neworders', async (req, res) => {
  try {
    await res.status(200).json([global.neworders]);

  }
  catch (error) {
    console.log('error:', error);
    res.status(400).json({ success: false });
  }
});

app.get('/api/custompizza', async (req, res) => {
  try {
    console.log(global.CustomPizza_data)
    res.status(200).json(global.CustomPizza_data);

  }
  catch (error) {
    console.log('error:', error);
    res.status(400).json({ success: false });
  }
});


app.post('/api/update-order-status', async (req, res) => {
  try {
    const { customerId, status } = req.body;
    const user = await User.findById(customerId);

    for (const outerArray of user.PlacedOrders) {
      for (const order of outerArray) {
        if (order.Status === 'ordered') {
          order.Status = status;
        }
      }
    }

    await user.save();
    console.log('Updated status for all orders');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

app.delete('/api/cart/remove/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cartItemIndex = user.cartItem.findIndex(item => item.id === itemId);

    if (cartItemIndex !== -1) {
      user.cartItem.splice(cartItemIndex, 1);
      await user.save();

      res.json({ message: 'Item removed successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/forgotpassword', async (req, res) => {
  try {
    const email = req.body.useremail;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({ message: "User not registered!" })
    }
    else {

      res.status(200).json({ message: "User found!" })
    }
  }
  catch {
    res.status(400).json({ error: `server error` });
  }

});

let otpArray = [];

const generateRandomOTP = () => {
  let otp;
  do {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
  } while (otpArray.includes(otp));

  otpArray.push(otp);

  return otp;
};

let generatedOTP;

app.post('/api/sendotp', async (req, res) => {
  try {
    const email = req.body.useremail;
    console.log(email)
    generatedOTP = generateRandomOTP();
    console.log(generatedOTP)
    const existingUserOTP = await OTP.findOne({ email });
    if (existingUserOTP) {
      existingUserOTP.otp = generatedOTP;
      await existingUserOTP.save();
    }
    else {
      const otpDoc = new OTP({ email: email, otp: generatedOTP });
      await otpDoc.save();
    }

    console.log('saved');
    const emailcontent = EmailContent(generatedOTP);

    await sendEmailNotificationForotp(emailcontent);

    res.status(200).json({ message: "Email sent" });
  }
  catch {
    res.status(400).json({ error: `server error` });
  }

});

app.post('/api/verifyotp/:userotp', async (req, res) => {
  try {
    const inputOtp = req.params.userotp;
    //error scope
    console.log(inputOtp);
    const email = req.body.useremail;
    //error scope
    console.log(email);

    const otpRecord = await OTP.findOne({ email });
    const otp = otpRecord.otp;

    if (otp === inputOtp) {

      const userRecord = await User.findOne({ email });
      const Role = userRecord.role;
      const userId = userRecord._id;

      const data = {
        user: {
          id: userId
        }}
  
      const authtoken = jwt.sign(data, process.env.jwtSecret);

      res.status(200).json({ message: "OTP verified", userId: userId, authtoken: authtoken, Role: Role });
    }
    else {
      res.status(200).json({ message: "OTP declined" });
    }
  }
  catch {
    res.status(400).json({ error: `server error` });
  }

});

app.get('/api/checkuser/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (userId === "null") {
    return res.status(400).json({ error: 'User not found' });
  }
  else {
    return res.status(200).json({ sucess: true });
  }
});





app.get('/', (req, res) => {
  res.send('Hello from the server!');
});


app.listen(PORT, () => {
  console.log(`!!Server working on port: http://localhost:${PORT}`);
});
