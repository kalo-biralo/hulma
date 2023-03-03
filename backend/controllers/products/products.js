const productModel = require("../../models/product")

module.exports.addProduct = async (req, res) => {
    try{

        const {title, sku, price, image, quota, quotaFilled} = req.body;

        if(!title || !sku || !price || !quota || !quotaFilled) return res.send("Fields are empty")

        let product = new productModel(req.body)
        product.save()

        return res.json({
            success : true,
            message : "Product inserted successfully",
            data : product
        })

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.getProducts = async (req, res) => {
    try{

        const products = await productModel.find();
        const productsCount = await productModel.find().count();

        return res.json({
            success : true,
            status : 200,
            message : "list of all products",
            products,
            count : productsCount
        })

    }catch(error){
        return res.send(error.message)
    }
}


module.exports.updateProduct = async (req, res) => {
    try{

        const {title, sku, price, image, quota, quotaFilled} = req.body;
        const {id} = req.query;

        // check if product exist with the given product id
        const product = await productModel.findOne({_id : id})

        if(product){
            const updatedProduct = await productModel.findOneAndUpdate({_id : id}, req.body, {new :true})

            return res.json({
                success : true,
                status : 200,  
                message : "product updated successfully",
                data : updatedProduct
            })
        }else{
            
            return res.json({
                success : false,
                status : 400,
                message : "product does not exist"
            })

        }

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.deleteProduct = async (req, res) => {
    try{

        const {id} = req.query;
        
        // check if product exist with the given product id
        const product = await productModel.findOneAndDelete({_id : id})
        if(!product){
            return res.json({
                success : false,
                message : "product does not exist",
            })
        }
        return res.json({
            success : true,
            message : "product deleted successfully",
        })

    }catch(error){
        return res.send(error.message)
    } 
}

module.exports.getAllProducts = async (req, res) => {
    try{

        // Search through title names
        var {search} = req.query
        if(!search) search = ""

        const products = await productModel.find({title:{'$regex' : search, '$options' : 'i'}})
            .populate("category")

        return res.json({
            success : true,
            status : 200,
            message : "list of products",
            data : products
        })

    }catch(error){
        return res.json({
            success : false,
            status : 400,
            message : error.message
        })
    }
}

module.exports.addQuotaFillProduct = async (req, res) => {
    const {id} = req.query
  try {
    const product = await productModel.findOne({_id : id})
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.quotaFilled += 1;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product quotaFilled" });
  }
};

module.exports.subQuotaFillProduct = async (req, res) => {
    const {id} = req.query
  try {
    const product = await productModel.findOne({_id : id})
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.quotaFilled -= 1;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product quotaFilled" });
  }
};

module.exports.quotaFillProduct = async (req, res) => {
    const {id} = req.query
  try {
    const product = await productModel.findOne({_id : id})
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product quotaFilled" });
  }
};
  