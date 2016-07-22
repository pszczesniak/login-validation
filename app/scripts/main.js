/*jslint browser: true */
/*global Loginform */

var psw = document.getElementById('password'),
    email = document.getElementById('email'),
    form = document.getElementById('content').querySelector('form'),
    LoginFormAction = new Loginform();
psw.addEventListener('blur', function () {  'use strict'; LoginFormAction.checkPasswordValidation(psw.value); }, false);
email.addEventListener('blur', function () {  'use strict'; LoginFormAction.checkEmailValidation(email.value); }, false);
form.onsubmit = function () {
    'use strict';
    LoginFormAction.checkPasswordValidation(psw.value);
    LoginFormAction.checkEmailValidation(email.value);
    if (LoginFormAction.passwordState && LoginFormAction.emailState) {
      LoginFormAction.completeAjax(email.value, psw.value, form.action, LoginFormAction);
    }
    return false;
  };