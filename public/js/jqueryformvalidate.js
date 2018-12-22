$(document).ready(function () {
    $('#registerform').validate({ // initialize the plugin
        rules: {
            firstName: {
                required: true,
                minlength: 6,
                signupregex: true,
            },
            username: {
                required: true,
                minlength: 6,
                signupregex: true,
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                pwcheck: true,
                minlength: 8,
            },
            confirmationPassword: {
                required: true,
                equalTo: "#password"
            },
            confirmEmail: {
                required: true,
                equalTo: "#email"
            },
            terms: {
                required: true,
                
            }
        }
    });
},
$('#newServicesForms').validate({
    rules: {
        'services[postcode]': {
            required: true,        
            zipcode: true
        }
    }
})

);
jQuery.extend(jQuery.validator.messages, {
    username: "Username needs to contain min of 6 letters",
    firstName: "This field is required",    
    equalTo: "Please check your value",
    pwcheck: "Password to contain 8 letters, 1 uppercase, 1 lowercase and a digit",
})
$.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
        && /[A-Z]/.test(value) // has a uppercase
 });
 $.validator.addMethod("signupregex", function(value, element) {
    return this.optional(element) || /^[a-z0-9\-]+$/i.test(value);
}, "Must contain only letters, numbers, or dashes.");

$.validator.addMethod("zipcode", function(value, element) {
    return this.optional(element) || /^\d{6}(?:-\d{4})?$/.test(value);
  }, "Please provide a valid zipcode.");
