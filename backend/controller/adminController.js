import Admin from "../modal/admin.js";
// admin login controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    return res.json({ msg: "Login success", admin: admin.email });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};