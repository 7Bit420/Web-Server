# Mypage

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

### Creating a user
  to create a user make a POST requset to /user/create and uses the following form structure
  
    ```
      <form method="POST" action="/user/create">
        <input type="text" name="username">
        <input type="password" name="password">
        <!--
          Any other atrubtes that have been defined in the "usertemp.json" file
        -->
        <input type="submit">
      </form>
    ```
   
