const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto');
const makeToken = require('uniqid');
const { btoa, atob } = require("buffer");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname,mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
      const user = await User.findOne({ email });
  if (user) throw new Error("User has existed!")
    else{
      const token = makeToken()
      const emailedited = btoa(email) + "@" + token
      const newUser = await User.create({ email:emailedited, password, firstname, lastname, mobile })
      if(newUser){
        const html = `<h2>Register code:</h2> <br/> <blockquote>${token}</blockquote>`
      await sendMail({ email,html,subject: 'Confirm register account in XGear Viêm Đế'})
      }
      setTimeout(async() => {
       await User.deleteOne({email:emailedited}) 
      },[9000000])
      return res.json({
        success: newUser? true:false,
        mes:newUser? "Please check your email to active account":'Something went wrong, please try later.',
      });
    }
});

const finalRegister = asyncHandler(async(req,res) => {
    // const cookie = req.cookies
    const {token} = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`)})
    if(notActivedEmail){
      notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
      notActivedEmail.save()
    }
    return res.json({
      success: notActivedEmail? true:false,
      mes:notActivedEmail? "Register is Successfully. Please go login!":'Something went wrong, please try later.',
    });
})

// refresh token => lam moi access token
// access token => xac thuc,phan quyen nguoi dung
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // Tach password va role ra khoi response
    const { password, role,refreshToken, ...userData } = response.toObject();
    // Tao access token
    const accessToken = generateAccessToken(response._id, role);
    // Tao refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //Luu refreshToken vao database
    await User.findByIdAndUpdate(response._id, {newRefreshToken: refreshToken }, { new: true });
    // Luu refresh token vao cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData: response,
    });
  } else {
    throw new Error("Invalid crendentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password").populate({
    path:'cart',
    populate: {
      path: 'product',
      select: 'title thumb price quantity',
    },
  }).populate("wishlist","title thumb price color")
  return res.status(200).json({
    success: user? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Lay token tu cookie
  const cookie = req.cookies;
  // Check xem co token hay khong
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  //Check token co hop le hay khong
  jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err) throw new Error("Invalid refresh token");
      //Check token co khop voi token da luu trong db
      const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });
      return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
          ? generateAccessToken(response._id, response.role)
          : "Refresh token not matched",
      });
    }
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  //Xoa refresh token o db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout in done",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken()
  await user.save()

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
  
  const data = {
    email,
    html,
    subject: 'Forgot Password',
  }
  const rs = await sendMail(data)
    return res.status(200).json({
        success:rs.response?.includes('OK')? true:false,
        mes:rs.response?.includes('OK')? 'Check your mail please!':'Something went wrong. Please try again!'
    })

});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body
  if (!password || !token) throw new Error('Missing imputs')
  const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) throw new Error('Invalid reset token')
  user.password = password
  user.passwordResetToken = undefined
  user.passwordChangedAt = Date.now()
  user.passwordResetExpires = undefined
  await user.save()
  return res.status(200).json({
      success: user ? true : false,
      mes: user ? 'Updated password' : 'Something went wrong'
  })
})

const getUsers = asyncHandler(async (req, res) => {
  const queries = {...req.query}
    const excludeFields = ['limit', 'sort', 'page','fields']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)
    if(queries?.name) formatedQueries.name = {$regex: queries.name, $options :`i`}
    if(req.query.q){
      delete formatedQueries.q
      formatedQueries['$or'] = [
        {firstname : {$regex: queries.q, $options :`i`}},
        {lastname : {$regex: queries.q, $options :`i`}},
        {email : {$regex: queries.q, $options :`i`}}
      ]
    }
    let queryCommand = User.find(formatedQueries)

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand = queryCommand.skip(skip).limit(limit)

    try {
        const response = await queryCommand.exec();
        const counts = await User.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get users',
            
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params
  const response = await User.findByIdAndDelete(uid)
  return res.status(200).json({
      success: response ? true : false,
      mes: response ? `User with email ${response.email} deleted` : 'No user delete'
  })
})

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const {firstname,lastname,email,mobile,address} = req.body
  const data = {firstname,lastname,email,mobile,address}
  if(req.file) data.avatar = req.file.path
  if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
  const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
  return res.status(200).json({
      success: response ? true : false,
      mes: response ? 'Updated!' : 'Some thing went wrong'
  })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
  // 
  const { uid } = req.params
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
  const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
  return res.status(200).json({
      success: response ? true : false,
      mes: response ? 'Updated' : 'Some thing went wrong'
  })
})

const updateUserAddress = asyncHandler(async (req, res) => {
  // 
  const { _id } = req.user
  if (!req.body.address) throw new Error('Missing inputs')
  const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}}, { new: true }).select('-password -role -refreshToken')
  return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : 'Some thing went wrong'
  })
})

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color, price, thumbnail, title } = req.body;
  if (!pid || !color) throw new Error('Missing inputs');
  const user = await User.findById(_id).select('cart');
  const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color);
  
  if (alreadyProduct) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      { $set: { "cart.$.quantity": quantity, "cart.$.price": price, "cart.$.thumbnail": thumbnail, "cart.$.title": title } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "'Updated your cart!'" : 'Something went wrong',
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "'Updated your cart!'" : 'Something went wrong',
    });
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const {pid,color} = req.params
  const user = await User.findById(_id).select('cart')
  const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
  if(!alreadyProduct) return res.status(200).json({
    success:  true ,
    mes: 'Updated your cart!'
})
const response = await User.findByIdAndUpdate(_id,{$pull: {cart: {product: pid,color}}},{new: true})
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? 'Updated your cart!' : 'Some thing went wrong'
  })
})

const updateWishlist = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const {_id} = req.user
  const user = await User.findById(_id)
  const alreadyWishlist = user.wishlist?.find(el => el.toString() === pid)
  if(alreadyWishlist){
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response? "Update your wishlist." : "Failed to update wishlist!",
    });
  }else{
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response? "Update your wishlist." : "Failed to update wishlist!",
    });
  }
})

module.exports = {
  register,
  finalRegister,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  deleteUser,
  getCurrent,
  updateCart,
  removeProductInCart,
  updateWishlist,
};
