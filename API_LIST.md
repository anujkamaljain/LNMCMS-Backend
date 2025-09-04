SUPER ADMIN 

- /superadmin/students (POST)
- /superadmin/student (POST)
- /superadmin/admin (POST)
- /superadmin/superadmin (POST) 
- /superadmin/student (GET)
- /superadmin/admin (GET)
- /superadmin/student (DELETE)
- /superadmin/admin (DELETE)
- /superadmin/superadmin (DELETE)
- /superadmin/students (DELETE)
- /superadmin/student (PATCH)
- /superadmin/admin (PATCH)
- /superadmin/superadmin (PATCH)
- /superadmin/changepassword (PATCH)
- /superadmin/complaints/by-department (GET)
- /superadmin/complaints/monthly (GET)

ADMIN
- /admin/complaints/pending (GET)
- /admin/complaints/accepted (GET)
- /admin/complaints/resolved (GET)
- /admin/complaint/:id/accept (PATCH)
- /admin/changepassword (PATCH)

STUDENT 
- /student/complaints/:id (GET)
- /student/complaints (POST)
- /student/complaints/:id/resolve (PATCH)
- /student/complaints/public (GET)
- /student/complaint/upvote/:id (PATCH) 
- /student/forgotpassword (PATCH)

AUTH
- /auth/login (POST)
- /auth/logout (POST)