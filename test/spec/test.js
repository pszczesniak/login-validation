/* global describe, it */

(function () {
    'use strict';
    describe('Loginform', function() {
        var status = -1;
        var responseText = '';
        function callbackfn (data) {
            status = data;
            responseText = (new Loginform()).showResponse(data);
        }

        describe('#checkPasswordEmpty', function() {
            it('should check password is empty', function() {
                var psw = (new Loginform()).checkPasswordEmpty('');
                expect(psw).to.equal(false);
            });
        });
        describe('#checkPasswordEmpty', function() {
            it('should check password is not empty', function() {
                var psw = (new Loginform()).checkPasswordEmpty('aaa');
                expect(psw).to.equal(true);
            });
        });
        
        describe('#checkPasswordLength', function() {
            it('should check password length less then six characters', function() {
                var psw = (new Loginform()).checkPasswordLength('aaa');
                expect(psw).to.equal(false);
            });
        });
        describe('#checkPasswordLength', function() {
            it('should check password length gte six characters', function() {
                var psw = (new Loginform()).checkPasswordLength('aaabbbccc');
                expect(psw).to.equal(true);
            });
        });
        
        describe('#checkPasswordContainsNumber', function() {
            it('should check password if it\'s not contain any number', function() {
                var psw = (new Loginform()).checkPasswordContainsNumber('aaabbbccc');
                expect(psw).to.equal(false);
            });
        });
        describe('#checkPasswordContainsNumber', function() {
            it('should check password if it\'s contain any number', function() {
                var psw = (new Loginform()).checkPasswordContainsNumber('aaa1bbb3ccc0');
                expect(psw).to.equal(true);
            });
        });
        
        describe('#checkPasswordContainsSmallLetter', function() {
            it('should check password if it\'s not contain any small letters', function() {
                var psw = (new Loginform()).checkPasswordContainsSmallLetter('ASDASD1234');
                expect(psw).to.equal(false);
            });
        });
        describe('#checkPasswordContainsSmallLetter', function() {
            it('should check password if it\'s contain any small letters', function() {
                var psw = (new Loginform()).checkPasswordContainsSmallLetter('ASDasd1234');
                expect(psw).to.equal(true);
            });
        });
        
        describe('#checkPasswordContainsBigLetter', function() {
            it('should check password if it\'s not contain any big letters', function() {
                var psw = (new Loginform()).checkPasswordContainsBigLetter('asdasd1234');
                expect(psw).to.equal(false);
            });
        });
        describe('#checkPasswordContainsBigLetter', function() {
            it('should check password if it\'s contain any big letters', function() {
                var psw = (new Loginform()).checkPasswordContainsBigLetter('ASDasd1234');
                expect(psw).to.equal(true);
            });
        });
        
        describe('#checkEmailEmpty', function() {
            it('should check email is empty', function() {
                var email = (new Loginform()).checkEmailEmpty('');
                expect(email).to.equal(false);
            });
        });
        describe('#checkEmailEmpty', function() {
            it('should check email is not empty', function() {
                var email = (new Loginform()).checkEmailEmpty('asd@');
                expect(email).to.equal(true);
            });
        });
        
        describe('#checkCorrectEmail', function() {
            it('should check if the email is compliant with RFC2822', function() {
                var email = (new Loginform()).checkCorrectEmail('some@email.ok');
                expect(email).to.equal(true);
            });
        });
        describe('#checkCorrectEmail', function() {
            it('should check if the email is not compliant with RFC2822', function() {
                var email = (new Loginform()).checkCorrectEmail('not ok @');
                expect(email).to.equal(false);
            });
        });

        /*describe('#Real AJAX request', function(){
            var p = new Loginform();
            p.ajaxRequest('ema@il','Passw0rd','http://api.test/auth', callbackfn);
            var flag = false;
            beforeEach(function(done) {
                setTimeout(function() {
                    flag = true;
                    done();
                }, 500);
            });
           
            it('with status === 201 message should be equal \"logowanie poprawne\"', function() {
                expect(responseText).to.equal('logowanie poprawne');
            });
            it('with status === 401 message should be equal \"niepoprawne login lub hasło\"', function() {
                expect(responseText).to.equal('niepoprawne login lub hasło');
            });
            it('with status === 400 message should be equal \"niepoprawne dane\"', function() {
                expect(responseText).to.equal('niepoprawne dane');
            });
            it('with status === 500 message should be equal \"błąd usługi\"', function() {
                expect(responseText).to.equal('błąd usługi');
            });
        });*/
        
        describe('#showResponse check response status using sinon.fakeServer', function() {
            var server;
            var p = new Loginform();
            beforeEach(function () {
                server = sinon.fakeServer.create();
            });
            afterEach(function () {
                server.restore();
            });
            it('with status === 201 message should be equal \"logowanie poprawne\"', function(done) {
                server.respondWith(
                    'POST',
                    [201, { 'Content-Type': 'application/json' }, JSON.stringify('{"test": test}')]
                );
                server.respond();
                var fakeStatus = server.responses[0].response[0];
                expect(p.showResponse(fakeStatus)).to.equal('logowanie poprawne');
                done();
            });
            it('with status === 401 message should be equal \"niepoprawne login lub hasło\"', function(done) {
                server.respondWith(
                    'POST',
                    [401, { 'Content-Type': 'application/json' }, JSON.stringify('{"test": test}')]
                );
                server.respond();
                var fakeStatus = server.responses[0].response[0];
                expect(p.showResponse(fakeStatus)).to.equal('niepoprawne login lub hasło');
                done();
            });
            it('with status === 400 message should be equal \"niepoprawne dane\"', function(done) {
                server.respondWith(
                    'POST',
                    [400, { 'Content-Type': 'application/json' }, JSON.stringify('{"test": test}')]
                );
                server.respond();
                var fakeStatus = server.responses[0].response[0];
                expect(p.showResponse(fakeStatus)).to.equal('niepoprawne dane');
                done();
            });
            it('with status === 500 message should be equal \"błąd usługi\"', function(done) {
                server.respondWith(
                    'POST',
                    [500, { 'Content-Type': 'application/json' }, JSON.stringify('{"test": test}')]
                );
                server.respond();
                var fakeStatus = server.responses[0].response[0];
                expect(p.showResponse(fakeStatus)).to.equal('błąd usługi');
                done();
            });
        });
    });
})();
