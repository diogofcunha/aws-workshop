export const isInvalidContentType = contentType =>
  typeof contentType !== "string" ||
  !(
    /^image\/[a-z0-9\-]+/.test(contentType) ||
    /^video\/[a-z0-9\-]+/.test(contentType)
  );
