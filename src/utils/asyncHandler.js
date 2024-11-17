const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export { asyncHandler };

// wrapper function ..............................................
//  const asyncHandler = (requestHandler) => async (req,res,next) =>{
//     try{
//         requestHandler(req,res,next);
//     }catch(error){
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
//  }
