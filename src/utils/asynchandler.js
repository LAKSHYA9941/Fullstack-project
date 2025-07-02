const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).rejects((err)=>next(err));
  };
};

export default asyncHandler;
