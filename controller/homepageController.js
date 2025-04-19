// import jwt from "jsonwebtoken";
// import Banner from "../model/banner.js";
// import Category from "../model/courseCategory.js";
// import Course from "../model/course.js";
// import PopularCategory from "../model/popularCategory.js";
// import User from "../model/user.js";
// import NodeCache from "node-cache";

// export const getHomePage = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     let user = null;
//     let myClasses = [];

//     if (token) {
//       try {
//         // ✅ Decode token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         // ✅ Fetch user with skills (no UserSkills in result)
//         user = await User.findByPk(userId, {
//           include: [
//             {
//               association: "skills",
//               through: { attributes: [] },
//               attributes: ["id", "skill"],
//             },
//           ],
//         });

//         if (user) {
//           const myCourses = await user.getMyCourses();
//           myClasses = myCourses.map((course) => ({
//             ...course.toJSON(),
//             purchase_status: true,
//           }));
//         }
//       } catch (err) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid or expired token" });
//       }
//     }

//     // 🎯 Filter recommended courses by user skill_name if available
//     const recommendedCourses = await Course.findAll({
//       where:
//         token && user?.skills?.length
//           ? {
//               category: user.skills.map((s) => s.skill),
//             }
//           : {},
//     });

//     const banners = await Banner.findAll();
//     const categories = await Category.findAll();
//     const popularCategories = await PopularCategory.findAll();

//     res.json({
//       success: true,
//       message: "Success",
//       banners,
//       categories,
//       skills: user ? user.skills : [],
//       courses: [
//         {
//           title: "My Classes",
//           list: myClasses,
//         },
//         {
//           title: "Recommended Classes",
//           list: recommendedCourses.map((course) => ({
//             ...course.toJSON(),
//             purchase_status: false,
//           })),
//         },
//       ],
//       popular: {
//         categories: popularCategories,
//         contact: "1234567890",
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addBanner = async (req, res) => {
//   try {
//     const { image, title } = req.body;

//     if (!image) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });
//     }

//     const banner = await Banner.create({ image, title });
//     res
//       .status(201)
//       .json({ success: true, message: "Banner added", data: banner });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Add Category
// export const addCategory = async (req, res) => {
//   try {
//     const { title, icon } = req.body;

//     if (!title) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Title is required" });
//     }

//     const category = await Category.create({ title, icon });
//     res
//       .status(201)
//       .json({ success: true, message: "Category added", data: category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
