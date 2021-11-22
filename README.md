# Mypage Beta
Note that this is a beta, there will be bugs.
## Pages
A webpage is structerd like this

```
Main page Directory
|- Page Directory (Named of name of the page)
  |
  |- Index.html (This file contains the text for the page)
  |- Local files refernced with (/ + The name of the file)
  |
  |-Subpages following the same format as this page
```
  
### Global files
  This files are in the "resource" directory
  thry can be accesed by /resource + the name of the file
  
## Users

### Logging in a user
  to log in a user make a requset to /login with the header token: "Users JWT token" the server will respond with a sessionid that is valid for 6 hours

### Creating a user
  to create a user make a POST requset to /user/create and uses the following form structure
  
```html
  <form method="POST" action="/user/create">
    <input type="text" name="username">
    <input type="password" name="password">
    <!--
      Any other atrubtes that have been defined in the "usertemp.json" file
    -->
    <input type="submit">
    </form>
```
### Editing a user
  to edit a user's attrubute make the following json request to user /user/set
  
   ```
    POST /user/test
    sessionid: id
    type: string
    
    ---Payload---
    {
      "username":"kent"
      //any other valuse that you want to change 
    }
    ---End Payload---
   ```
   
   to edit a user's make the following json request to user /user/set
   
   ```
    POST /user/test
    sessionid: id
    type: file
    
    ---Payload---
    
    file
    
    ---End Payload---
   ```
### Managing a user's files

  #### Creating a file 
  Make a put requsst with the following structure
  ```
  PUT /user/fs/ + file name
  sessionid: id
  
  ---Payload---
  File
  ---End Payload
  
  ```
  
   #### Geting a file 
  Make a get requsst with the following structure
  ```
  GET /user/fs/ + file name
  sessionid: id
  ```
  
  #### Deleting a file 
  Make a delete requsst with the following structure
  ```
  DELETE /user/fs/ + file name
  sessionid: id
  ```

