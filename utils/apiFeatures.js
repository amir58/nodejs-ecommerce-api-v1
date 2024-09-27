class ApiFetaures {

    constructor ( mongooseQuery, queryString ) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    paginate( countDocuments ) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = ( page - 1 ) * limit;
        const endIndex = page * limit;

        // Paging results
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil( countDocuments / limit );

        // nextPage : page + 1 > totalPages ? null : page + 1,
        if ( endIndex < countDocuments ) {
            pagination.nextPage = page + 1;
        }

        // prevPage : page - 1 < 1 ? null : page - 1,
        if ( skip > 0 ) {
            pagination.previousPage = page - 1;
        }


        this.mongooseQuery = this.mongooseQuery.skip( skip ).limit( limit );
        this.pagingResults = pagination;
        return this;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = [ 'page', 'sort', 'limit', 'fields', 'keyword' ];
        excludedFields.forEach( el => delete queryObj[ el ] );

        let queryStr = JSON.stringify( queryObj );
        queryStr = queryStr.replace( /\b(gte|gt|lte|lt)\b/g, match => `$${ match }` );
        this.mongooseQuery.find( JSON.parse( queryStr ) );
        return this;
    }

    sort() {
        if ( this.queryString.sort ) {
            const sortBy = this.queryString.sort.split( ',' ).join( ' ' );
            this.mongooseQuery = this.mongooseQuery.sort( sortBy );
        } else {
            this.mongooseQuery = this.mongooseQuery.sort( '-createdAt' );
        }
        return this;
    }

    limitFields() {
        if ( this.queryString.fields ) {
            const fields = this.queryString.fields.split( ',' ).join( ' ' );
            this.mongooseQuery = this.mongooseQuery.select( fields );
        } else {
            this.mongooseQuery = this.mongooseQuery.select( '-__v' );
        }
        return this;
    }


    search( model ) {
        if ( this.queryString.keyword ) {
            let query = {};
            if ( model === "products" ) {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: "i" } },
                    { description: { $regex: this.queryString.keyword, $options: "i" } }
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: "i" } };
            }
            this.mongooseQuery = this.mongooseQuery.find( query );
        }
        return this;
    }
}

module.exports = ApiFetaures;