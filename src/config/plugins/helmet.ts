import helmet from 'helmet';

export default helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'", "blob: https://fintecimal-test.s3.amazonaws.com/"],
      'img-src': ["'self'", "blob: data: https://fintecimal-test.s3.amazonaws.com/"],
    }
  }
});
