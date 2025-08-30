// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis
const superadminemail = 'superadmin@example.com';
// Define your API endpoints
const loginapi = `${baseurl}/api/auth/login`;
const registerapi = `${baseurl}/api/auth/register`;
const userlistapi = `${baseurl}/api/auth/users`;
const logoutapi = `${baseurl}/api/auth/logout`;

// Export as named exports
export { loginapi, registerapi, logoutapi, superadminemail };

// OR export them as a single object
const apis = {
  loginapi,
  registerapi,
  logoutapi,
  userlistapi,
  superadminemail
};

export default apis; // Default export with all APIs
