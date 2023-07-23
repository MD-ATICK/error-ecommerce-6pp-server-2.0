
class apiFeatures {
    constructor(productData , query ){
        this.productData = productData
        this.query = query
    }

    search () {
        const keyword = this.query.keyword ? { productname : { $regex : this.query.keyword , $options : 'i'}} : {} 
        this.productData = this.productData.find({...keyword})
        return this ;
    }

    filter () {
        const queryCopy = {...this.query}
        const removeFeild = ['keyword' , 'page' , 'limit']

        removeFeild.map((key) => delete queryCopy[key])

        let queryCopyString = JSON.stringify(queryCopy)

        queryCopyString = queryCopyString.replace(/\b(gt|gte|lt|lte)\b/g , value => `$${value}`)
        this.productData = this.productData.find(JSON.parse(queryCopyString))
      
        return this;    
    }

    pagination () {
        const currentPage = Number(this.query.page) || 1 
        const resultPerPage = Number(this.query.limit) || 8
        const skipProducts = ( resultPerPage * currentPage ) - resultPerPage
        this.productData = this.productData.limit(resultPerPage).skip(skipProducts)
        return this ;
    }
}

module.exports = apiFeatures ;