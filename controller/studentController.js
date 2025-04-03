import Student from "../model/Student.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
export const studentRegistration = async (req, res) => {
  const student = req.body;
  try {
    if (!student) {
      return res.status(400).json({ message: "data is empty" });
    }

    student.password = await bcrypt.hash(student.password, 10);

    const savedStudent = await Student.create(student);
    const { password, ...studentWithoutPassword } = savedStudent.dataValues;

    res.status(200).json({
      message: "Student registration completed successfully",
      data: studentWithoutPassword,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "registration failed" });
  }
};
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(student);
    res.status(200).json({
      message: "Login successful.",
      status: true,
      data: {
        userId: student.id,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
