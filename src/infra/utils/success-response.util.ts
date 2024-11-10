const successResponseUtil = (data, meta = {}) => {
  return {
    success: true,
    error: false,
    data,
    meta,
  };
};

export default successResponseUtil;