import mongoose from "mongoose";
import dotenv from "dotenv";
import DefaultItem from "../schemas/defaultItem.js";
import { connectDB } from "../lib/connectDB.js";

dotenv.config();

const defaultItems = [
  {
    name: "Voucher Giảm 10.000đ",
    pointToTrade: 50,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/voucher_10k.jpg",
  },
  {
    name: "Voucher Giảm 1.000đ",
    pointToTrade: 5,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/voucher_10k.jpg",
  },
  {
    name: "Voucher Giảm 20.000đ",
    pointToTrade: 100,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/voucher_20k.jpg",
  },
  {
    name: "Voucher Giảm 50.000đ",
    pointToTrade: 250,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/voucher_50k.jpg",
  },
  {
    name: "Voucher Giảm 100.000đ",
    pointToTrade: 500,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/voucher_100k.jpg",
  },
  {
    name: "Túi Vải Thân Thiện Môi Trường",
    pointToTrade: 150,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/eco_bag.jpg",
  },
  {
    name: "Ly Giữ Nhiệt Inox",
    pointToTrade: 300,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/thermal_cup.jpg",
  },
  {
    name: "Bộ Ống Hút Inox",
    pointToTrade: 200,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/metal_straws.jpg",
  },
  {
    name: "Hộp Đựng Cơm Thủy Tinh",
    pointToTrade: 350,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/glass_lunchbox.jpg",
  },
];

const seedDefaultItems = async () => {
  try {
    await connectDB();

    console.log("Đang xóa dữ liệu phần thưởng cũ...");
    await DefaultItem.deleteMany({});

    console.log("Đang thêm dữ liệu phần thưởng mới...");
    const items = await DefaultItem.insertMany(defaultItems);

    console.log(`Đã seed thành công ${items.length} phần thưởng!`);
    console.log("Danh sách phần thưởng:");
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.pointToTrade} điểm`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedDefaultItems();
