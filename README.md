1. Download mysql database and install
2. Create a database called gym\_tracker
3. Create a .env file with the following information at the root of your api code location.

NODE\_ENV=development
PORT=3001
DB\_HOST=localhost
DB\_USER=root
DB\_PASSWORD=\[Insert your password]
DB\_NAME=gym\_tracker

4. From your terminal window run this

npm install express mysql2 dotenv cors
npm install express --save



5. Not go to you browser and verify that you have a functional API.

http://localhost:3001 -- Should return a health check page.

http://localhost:3001/test  -- Should return your database version



6. Please put your database scripts in the database-scripts folder

Example:  I am working on the exercise demo section area.  Script Name Exercises.sql



