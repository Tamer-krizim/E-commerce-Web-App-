class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  /**
   * @title Filtering
   * @dec   get the list of item with filter in somthing
   * @ex    ?{sort=name} OR {price[lte]=50}
   */
  filter() {
    // filtering the query
    const queryStringObj = { ...this.queryString };
    // Ignoring the type of string with the {req}
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Apply Filteration using [gte, gt, lte, lt]
    let querStr = JSON.stringify(queryStringObj);
    querStr = querStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querStr));

    return this;
  }

  /**
   * @title Sorting
   * @dec just to spliting by {,} then return with out {,} for mongoose Query
   * @ex  "price,-sold" => "price -sold"
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      // give me the latest product
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }

    return this;
  }

  /**
   * @title Fields Limiting
   * @dec just to spliting by {,} then return with out {,} for mongoose Query
   * @ex "title,price,imageCover,ratingsAverage" => "title price imageCover ratingsAverage"
   * @test "title" => return title {}=> "-title" retrun all data with out title
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  /**
   * @title Searching
   * @dec   this statment for searching in title or description
   * @ex    ?keyword ={mens} or {MENS} not sensiteve
   */
  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};

      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  // pagination
  /**
   * @title pagination
   * @dec   this for retrun the limet of item in the single page
   * @ex    ?page=1&limit=10
   */
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit; // 2*10 => 20

    // pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next and prev page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginateResult = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
