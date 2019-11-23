module.exports = {
    entry: {
        homepage:'./app/components/homepage/homepage.js',
        login: './app/components/login/login.js',
        signup: './app/components/signup/signup.js',
        manageaccount:'./app/components/manage-account/manageaccount.js',
        personalinfor:'./app/components/manage-account/personal-infor.js',
        redirect:'./app/components/login/redirect.js',
        changepassword:'./app/components/manage-account/change-password.js',
        message: './app/components/manage-account/message.js',
        favoritelist:'./app/components/users/favoritelist.js',
        historyorder:'./app/components/users/historyorder.js',
        detailproduct: './app/components/users/detail-product.js',
        loginadmin:'./app/components/admin/login/login.js',
        dashboard:'./app/components/admin/dashboard/dashboard.js',
        manageuser:'./app/components/admin/manage/user.js',
        changepasswordad:'./app/components/admin/infor/changepassword.js',
        manageproduct:'./app/components/admin/manage/product.js',
        categoryproduct: './app/components/users/categoryproduct.js',
        managecategory: './app/components/admin/manage/category.js'
    },
    output: {
      path: __dirname,
      filename: './public/bundle/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/react"]
          }
        }
      ]
    }
}