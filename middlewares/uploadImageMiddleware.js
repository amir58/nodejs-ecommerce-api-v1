const multer = require( "multer" );
const ApiError = require( "../utils/apiError" );

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();

    const multerFilter = function ( req, file, cb ) {
        if ( file.mimetype.startsWith( "image" ) ) {
            cb( null, true );
        } else {
            cb( new ApiError( "Only images allowed." ), false );
        }
    };

    const upload = multer( {
        storage: multerStorage,
        fileFilter: multerFilter,
    } );

    return upload;
}

exports.uploadSingleImage = ( fieldName ) =>
    multerOptions().single( fieldName );

exports.uploadMixOfImages = ( fileds ) =>
    multerOptions().array( fileds );


// const multerStorage = multer.diskStorage( {
//     destination: ( req, file, cb ) => {
//         cb( null, "uploads/categories" );
//     },
//     filename: ( req, file, cb ) => {
//         const ext = file.mimetype.split( "/" )[ 1 ];
//         cb( null, `category-${ uuid() }-${ Date.now() }.${ ext }` );
//     },
// } );
