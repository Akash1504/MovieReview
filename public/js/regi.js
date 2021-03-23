function USER() {
    var firstname = document.forms["RegForm"]["firstname"];
    var lastname = document.forms["RegForm"]["lastname"];
    var password = document.forms["RegForm"]["password"];
    var confirmpassword = document.forms["RegForm"]["confirmpassword"];
    var email = document.forms["RegForm"]["email"];
    var phone = document.forms["RegForm"]["phone"];
    var role = document.forms["RegForm"]["role"];
   

    if (firstname.value == "") {
        window.alert("Please enter your name.");
        name.focus();
        return false;
    }
    
    if (lastname.value == "") {
        window.alert("Please enter your name.");
        name.focus();
        return false;
    }
    if (password.value == "") {
        window.alert("Please enter your password");
        password.focus();
        return false;
    }
    if (confirmpassword.value == "") {
        window.alert("Please enter your password");
        password.focus();
        return false;
    }
   

    if (email.value == "") {
        window.alert(
          "Please enter a valid e-mail address.");
        email.focus();
        return false;
    }

    if (phone.value == "") {
        window.alert(
          "Please enter your telephone number.");
        phone.focus();
        return false;
    }

   
    if (role.value == "") {
        window.alert(
          "Please enter your role.");
        phone.focus();
        return false;
    }

    return true;
}