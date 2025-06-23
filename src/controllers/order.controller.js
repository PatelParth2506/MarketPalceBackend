const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");
const db = require("../models/index");
const { fn, col, Op, where } = require("sequelize");
const { HTTP_CODE, HTTP_STATUS } = require("../utils/constans");
const Order = db.Order;
const Product = db.Product;
const OrderProduct = db.OrderProduct;

const ctrlPlaceOrder = async (req, res) => {
  const { order_items } = req.body;
  if (!order_items) {
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Order Items Is Needed To Update"
    );
  }

  let totalPrice = 0;
  let orderData = [];

  for (const item of order_items) {
    const product = await Product.findByPk(item.id);
    if (!product) {
      throw new apiError(
        HTTP_STATUS.DATA_NOT_FOUND,
        `No Product Found With ${item.id} Id`
      );
    }

    let price;
    if (product.discountedPrice === 0) {
      price = product.price * item.quentity;
    } else {
      price = product.discountedPrice * item.quentity;
    }
    totalPrice += price;

    orderData.push({
      product_id: product.id,
      product_name: product.product_title,
      product_price: product.price,
      product_discounted_price: product.discountedPrice,
      quentity: item.quentity,
    });
  }

  const order = await Order.create({
    user_id: req.user.id,
    totalPrice,
    order_status: "pending",
  });
  if (!order) {
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error Creating Order"
    );
  }

  for (const op of orderData) {
    await OrderProduct.create({
      order_id: order.id,
      ...op,
    });
  }

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Order Created SuccessFully", order));
};

const ctrlUpdateProduct_status = async (req, res) => {
  const order = await Order.findByPk(req.body.id);
  if (!order) {
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      " No Order Found With This Details "
    );
  }

  if (order.user_id !== req.user.id && req.user.role === "user") {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  order.order_status = req.body.order_status;
  await order.save();

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Status Updated SuccessFully"));
};

const ctrlGetAllOrders = async (req, res) => {
  let orders;

  if (req.user.role === "user") {
    orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: {
        model: db.OrderProduct,
        attributes: [
          "product_id",
          "product_name",
          "product_price",
          "product_discounted_price",
          "quentity",
        ],
      },
    });
  } else {
    orders = await Order.findAll({
      include: {
        model: db.OrderProduct,
        attributes: [
          "product_id",
          "product_name",
          "product_price",
          "product_discounted_price",
          "quentity",
        ],
      },
    });
  }
  if (!orders) {
    throw new apiError(HTTP_STATUS.DATA_NOT_FOUND, "No Orders Found");
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "All Orders Fetched SuccessFully", orders)
    );
};

const ctrlGetSingleOrder = async (req, res) => {
  const order = await Order.findByPk(req.body.id, {
    include: {
      model: db.OrderProduct,
      attributes: [
        "product_id",
        "product_name",
        "product_price",
        "product_discounted_price",
        "quentity",
      ],
    },
  });
  if (!order) {
    throw new apiError(HTTP_STATUS.DATA_NOT_FOUND, "No Order Found");
  }

  if (order.user_id !== req.user.id && req.user.role === "role") {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Order Fetched SuccessFullly", order));
};

const ctrlGetOrderStats = async (req, res) => {
  if (req.user.role === "user") {
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "You Don't Have Access To This Api"
    );
  }

  const totalOrders = await Order.count();
  const orderstatus = await Order.findAll({
    attributes: ["order_status", [fn("COUNT", col("order_status")), "count"]],
    group: ["order_status"],
  });

  const map = {
    pending: 0,
    delivered: 0,
    rejected: 0,
  };

  orderstatus.forEach((element) => {
    map[element.order_status] = parseInt(element.dataValues.count);
  });

  const revenue = await Order.findOne({
    attributes: [[fn("SUM", col("totalPrice")), "sum"]],
  });

  const totalRevenue = parseInt(revenue.dataValues.sum || 0);

  res.status(HTTP_STATUS.OK).json(
    new apiResponse(HTTP_CODE.OK, "All Stats Fetched SuccessFully", {
      totalRevenue,
      totalOrders,
      ...map,
    })
  );
};

const ctrlGetDateWiseOrder = async (req, res) => {
  const { startDate, endDate } = req.body;
  const startingdate = new Date(startDate);
  const endingdate = new Date(endDate);
  const order = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startingdate,
        [Op.lte]: endingdate,
      },
    },
  });
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Fetched", order));
};

module.exports = {
  ctrlPlaceOrder,
  ctrlUpdateProduct_status,
  ctrlGetAllOrders,
  ctrlGetSingleOrder,
  ctrlGetOrderStats,
  ctrlGetDateWiseOrder,
};
