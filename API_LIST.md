SUPER ADMIN 

- /superadmin/students (POST)
- /superadmin/student (POST)
- /superadmin/admins (POST)
- /superadmin/superadmins (POST) 
- /superadmin/students (PATCH)
- /superadmin/admins (PATCH)
- /superadmin/superadmins (PATCH)
- /superadmin/students (GET)
- /superadmin/admins (GET)
- /superadmin/superadmins (GET)
- /superadmin/students (DELETE)
- /superadmin/admins (DELETE)
- /superadmin/superadmins (DELETE)
- /superadmin/student (DELETE)

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