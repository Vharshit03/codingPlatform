const validator = require("validator")


const Validate = (data)=>{

    const Mandatoryfields = ["firstName","emailId","password"]

    const isAllowed = Mandatoryfields.every((v)=> Object.keys(data).includes(v))

    if(!isAllowed)
        throw new Error("fields are Missing")

    if(!validator.isEmail(data.emailId))
        throw new Error("Please fill Valid Email address")

    if(!validator.isStrongPassword(data.password))
        throw new Error("weak Password")
}

module.exports = Validate