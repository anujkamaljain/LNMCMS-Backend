SUPER ADMIN 

- /superadmin/students (POST)
- /superadmin/admins (POST)
- /superadmin/students (PATCH)
- /superadmin/admins (PATCH)

ADMIN
- /admin/complaints (GET)
- /admin/complaints/:id/accept (PATCH)
- /admin/changepassword (PATCH)

STUDENT 
- /student/complaints/:id (GET)
- /student/complaints (POST)
- /student/complaints/:id/resolve (PATCH)
- /student/forgotpassword (PATCH)

AUTH
- /auth/login (POST)
- /auth/logout (POST)