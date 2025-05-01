import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Stripe from 'stripe';
import CustomerPoints from '../models/customerPointsModel.js';
import CustomerPointsUsage from '../models/customerPointsUsageModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://192.168.0.174:3000";
  try {
    const { userId, items, amount, address, pointsToUse } = req.body;

    // 检查用户积分是否足够
    const customerPoints = await CustomerPoints.findOne({ where: { customerId: userId } });
    if (customerPoints && customerPoints.points < pointsToUse) {
      return res.json({ success: false, message: 'Insufficient points' });
    }

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address
    });

    // 如果使用了积分，更新积分信息
    if (pointsToUse > 0) {
      const newPoints = customerPoints.points - pointsToUse;
      await customerPoints.update({ points: newPoints });
      await CustomerPointsUsage.create({
        orderId: newOrder.id,
        loyaltyId: customerPoints.loyaltyId,
        usageDate: new Date()
      });
      // 更新订单总金额
      const newTotalAmount = amount - (pointsToUse / 10);
      await newOrder.update({ amount: newTotalAmount });
    }

    await User.update({ cartData: {} }, { where: { id: userId } });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.update({ payment: true }, { where: { id: orderId } });
      res.json({ success: true, message: "Paid" });
    } else {
      await Order.destroy({ where: { id: orderId } });
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.body.userId } });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await User.findOne({ where: { id: req.body.userId } });
    if (userData && userData.role === "admin") {
      const orders = await Order.findAll();
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await User.findOne({ where: { id: req.body.userId } });
    if (userData && userData.role === "admin") {
      await Order.update({ status: req.body.status }, { where: { id: req.body.orderId } });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };