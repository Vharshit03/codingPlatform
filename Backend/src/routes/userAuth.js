const express = require("express")
const {register,login,logout,adminRegister,deleteProfile} = require("../controllers/Auth")
const auth = require("../middleware/authUser")
const admin = require("../middleware/adminMiddleware")

const authRouter = express.Router()


authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",auth,logout)
authRouter.post("/admin/register",admin,adminRegister)
authRouter.delete("/delete",auth,deleteProfile)
authRouter.get("/check",auth,(req,res)=>{

    const data = req.results

    res.status(200).json({
        user:{
          firstName:data.firstName,
          _id: data._id,
          emailId: data.emailId
        },
        message: "user Authenticated"
    })
})

module.exports = authRouter