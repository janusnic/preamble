/* jslint eqeq: true */
/* jshint strict: false */
/* global configure, describe, beforeEach, afterEach, it, spyOn, expect, -getUiTestContainerElement, -getUiTestContainerElementId */

/**
 * inline configuration
 * NOTE: inline configuration cannot be used to set "windowGlobals"!
 */
configure({
    name: 'Sample Suite',
    timeoutInterval: 50,
    hidePassedTests: false
});

describe('"describe" is used to describe a suite which can contain one or more specs', function(){
    it('and "it" is used to describe a spec and is used to group one or more expectations"', function(){
        expect(true).toBeTrue();
        expect(false).not.toBeTrue();
        expect('abc').toEqual('abc');
        expect(123).not.toEqual('abc');
    });
});

describe('suites can  be nested', function(){
    describe('nested suite 1', function(){
        it('spec 1.1', function(){
            expect(1).toBeTruthy();
        });
    });
    describe('nested suite 2', function(){
        it('spec 2.1', function(){
            expect(0).not.toBeTruthy();
        });
    });
});

describe('specs can be run asynchronously', function(){
var count = 0;
    it('and calling done signals to Preamble that the asynchronous process has completed ', function(done){
        setTimeout(function(){
            count = 100;
            done(function(){
                expect(count).toEqual(100);
            });
        }, 1);
    });
});

describe('Using beforeEach to synchronously execute common code before each test', function(){
    var count = 0;
    beforeEach(function(){
        count = 1;
    });
    it('count equals 1', function(){
        expect(count).toEqual(1);
        count = 2;
    });
    it('count still equals 1', function(){
        expect(count).toEqual(1);
    });
});

describe('Using afterEach to synchronously execute common code after each test', function(){
    var count = 0;
    afterEach(function(){
        count = 1;
    });
    it('count equals 0', function(){
        expect(count).toEqual(0);
        count = 2;
    });
    it('count still equals 1', function(){
        expect(count).toEqual(1);
    });
});

describe('Using beforeEach to asynchronously execute common code before each spec is called', function(){
    var count = 0;
    beforeEach(function(done){
        setTimeout(function(){
            count = 10;
            done();
        }, 1);
    });
    it('count equals 10', function(){
        expect(count).toEqual(10);
    });
});

describe('Using afterEach to asynchronously execute common code after each spec is called', function(){
    var count = 0;
    afterEach(function(done){
        setTimeout(function(){
            count = 1;
            done();
        }, 1);
    });
    it('this spec expects count to equal 0 and sets count to 10', function(){
        expect(count).toEqual(0);
        count = 10;
    });
    it('this spec expects count to equal 1', function(){
        expect(count).toEqual(1);
    });
});

describe('Preventing a spec from timing out', function(){
    var count = 0;
    beforeEach(function(done){
        setTimeout(function(){
            count = 10;
            done();
        }, 100);
    });
    it('by passing a timeout value when calling "it"', function(){
        expect(count).toEqual(10);
    }, 120);
});

describe('Sharing values between setups, specs and teardowns using "this"', function(){
    beforeEach(function(){
        this.value = 10;
    });
    it('this.value should equal 10', function(){
        expect(this.value).toEqual(10);
    });
    describe('works in nested suites also', function(){
        beforeEach(function(){
            this.otherValue = 100;
        });
        it('this.value should equal 10 and this.otherValue should equal 100', function(){
            expect(this.value).toEqual(10);
            expect(this.otherValue).toEqual(100);
        });
    });
    it('this.otherValue should not exist and this.value should equal 10', function(){
        expect(this.otherValue).toEqual(undefined);
        expect(this.value).toEqual(10);
    });
});

describe('Calling expect', function(){
    it('sets the actual value for the expectation', function(){
        expect(1).toBeTruthy();
    });
});

describe('Using not', function(){
    it('negates the intention of a matcher', function(){
        expect(0).not.toBeTruthy();
    });
});

describe('Calling toEqual', function(){
    it('sets the expectation that the actual and expected values are equal' , function(){
        var obj1 = {iAm: 'I am!'},
            obj2 = {iAm: 'I am!'},
            obj3 = {iAm: 'Obj3'};
        expect(obj1).toEqual(obj2);
        expect(obj2).not.toEqual(obj3);
    });
});

describe('Calling toBeTrue', function(){
    it('sets the expectation that the actual value is true' , function(){
        expect(true).toBeTrue();
        expect(false).not.toBeTrue();
    });
});

describe('Calling toBeTruthy', function(){
    it('sets the expectation that the actual value is truthy' , function(){
        expect(1).toBeTruthy();
        expect(0).not.toBeTruthy();
    });
});

describe('Calling toHaveBeenCalled', function(){
    it('sets the expectation that the actual value, a function, was called' , function(){
        var spy1 = spyOn(),
            spy2 = spyOn();
        spy1();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });
});

describe('Calling toHaveBeenCalledWith', function(){
    it('sets the expectation that the actual value, a function, was called with specific arguments' , function(){
        var spy = spyOn();
        spy('abc', 'def');
        expect(spy).toHaveBeenCalledWith('abc', 'def');
        expect(spy).not.toHaveBeenCalledWith('def', 'abc');
    });
});

describe('Calling toHaveBeenCalledWithContext', function(){
    it('sets the expectation that the actual value, a function, was called with a specific context' , function(){
        var someObject = {
                someFn: function(){}
            },
            someOtherObject = {} ;
        spyOn(someObject, 'someFn');
        someObject.someFn();
        expect(someObject.someFn).toHaveBeenCalledWithContext(someObject);
        expect(someObject.someFn).not.toHaveBeenCalledWithContext(someOtherObject);
    });
});

describe('Calling toHaveReturned', function(){
    it('sets the expectation that the actual value, a function, returned a specific value' , function(){
        var spy = spyOn().and.return({fName: 'George', lName: 'Washington'});
        spy();
        expect(spy).toHaveReturned({fName: 'George', lName: 'Washington'});
        expect(spy).not.toHaveReturned({fName: 'Washington', lName: 'George'});
    });
});

describe('Calling toHaveThrown', function(){
    it('sets the expectation that the actual value, a function, threw an exception', function(){
        var someFn = spyOn(function(arg){ return a + arg; }).and.callActual(),
            someOtherFn = spyOn(function(arg){ return arg; }).and.callActual();
        someFn(20);
        someOtherFn('abc');
        expect(someFn).toHaveThrown();
        expect(someOtherFn).not.toHaveThrown();
    });
});

describe('Calling toHaveThrownWithMessage', function(){
    it('sets the expectation that the actual value, a function, threw an exception with a specific message', function(){
        var someFn = spyOn().and.throwWithMessage('Whoops!');
        someFn();
        expect(someFn).toHaveThrownWithMessage('Whoops!');
        expect(someFn).not.toHaveThrownWithMessage('Whoops! That was bad.');
    });
});

describe('Calling toHaveThrownWithName', function(){
    it('sets the expectation that the actual value, a function, threw an exception with a specific name', function(){
        var someFn = spyOn().and.throwWithName('Error');
        someFn();
        expect(someFn).toHaveThrownWithName('Error');
        expect(someFn).not.toHaveThrownWithName('MinorError');
    });
});

describe('Calling spyOn() without arguments', function(){
    it('creates a spy from an anonymous function', function(){
        var anonFn = spyOn();
        anonFn();
        expect(anonFn).toHaveBeenCalled();
    });
});

describe('Calling spyOn(fn)', function(){
    it('creates a spy from the function fn', function(){
        var someSpy;
        function someFn(){}
        someSpy = spyOn(someFn);
        someSpy();
        expect(someSpy).toHaveBeenCalled();
    });
});

describe('Calling spyOn(object, methodName)', function(){
    it('creates a spy from object[methodName]', function(){
        var someObject = {
           someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn();
        expect(someObject.someFn).toHaveBeenCalled();
    });
});

describe('Calling spyOn.x(object, methodNames)', function(){
    it('creates a spy from object[methodName] for each methodName found in the array methodNames', function(){
        var someObject = {
           someFn: function(){},
           someOtherFn: function(){}
        };
        spyOn.x(someObject, ['someFn', 'someOtherFn']);
        someObject.someFn();
        expect(someObject.someFn).toHaveBeenCalled();
        someObject.someOtherFn();
        expect(someObject.someOtherFn).toHaveBeenCalled();
    });
});

describe('Calling calls.count()', function(){
    it('returns the number of times the spy was called', function(){
        var someFn = spyOn();
        someFn();
        expect(someFn.calls.count()).toEqual(1);
    });
});

describe('Calling calls.forCall(nth)', function(){
    it('returns an ACall object', function(){
        var someFn = spyOn(),
            aCall;
        someFn();
        aCall = someFn.calls.forCall(0);
        expect(aCall.hasOwnProperty('context')).toBeTrue();
        expect(aCall.hasOwnProperty('args')).toBeTrue();
        expect(aCall.hasOwnProperty('error')).toBeTrue();
        expect(aCall.hasOwnProperty('returned')).toBeTrue();
    });
});

describe('Calling calls.all()', function(){
    it('returns an array of all the ACall objects associated with the spy', function(){
        var someFn = spyOn();
        someFn();
        expect(someFn.calls.all().length).toEqual(1);
    });
});

describe('Calling calls.wasCalledWith(...args)', function(){
    it('returns true if the spy was called with args and false if it was not called with args', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.wasCalledWith(123, 'abc', {zip: 55555})).toBeTrue();
    });
});

describe('Calling calls.wasCalledWithContext(object)', function(){
    it('returns true if the spy was called with the context object and false if it was not called with the context object', function(){
        var someObj = {
            someFn: function(){}
        };
        spyOn(someObj, 'someFn');
        someObj.someFn();
        expect(someObj.someFn.calls.wasCalledWithContext(someObj)).toBeTrue();
    });
});

describe('Calling calls.returned(value)', function(){
    it('returns true if the spy returned value and false if it did not return value', function(){
        var someObj = {
            someFn: function(num){return num;}
        };
        spyOn(someObj, 'someFn').and.callActual();
        someObj.someFn(123);
        expect(someObj.someFn.calls.returned(123)).toBeTrue();
    });
});

describe('Calling calls.threw()', function(){
    it('Returns true if the spy threw an exception and false if it did not throw an exception', function(){
        var someFn = spyOn().and.throw();
        someFn();
        expect(someFn.calls.threw()).toBeTrue();
    });
});

describe('Calling calls.threwWithMessage()', function(){
    it('Returns true if the spy threw an exception with message and false if it did not throw an exception with message', function(){
        var someFn = spyOn().and.throwWithMessage('Whoops!');
        someFn();
        expect(someFn.calls.threwWithMessage('Whoops!')).toBeTrue();
    });
});

describe('Calling calls.threwWithName()', function(){
    it('Returns true if the _spy_ threw an exception with **_name_** and false if it did not throw an exception with **_name_**', function(){
        var someFn = spyOn().and.throwWithName('Error');
        someFn();
        expect(someFn.calls.threwWithName('Error')).toBeTrue();
    });
});

describe('Calling reset', function(){
    it('resets the spy back to its default state', function(){
        var someFn = spyOn();
        someFn();
        expect(someFn).toHaveBeenCalled();
        someFn.and.reset();
        expect(someFn).not.toHaveBeenCalled();
    });
});

describe('Calling getContext()', function(){
    it('returns the context that was used for a specific call to the _spy_', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn();
        expect(someObject.someFn.calls.forCall(0).getContext()).toEqual(someObject);
    });
});

describe('Calling getArgs()', function(){
    it('returns an Args object for a specific call to the spy', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn(123);
        expect(someObject.someFn.calls.forCall(0).getArgs().args).toEqual([123]);
    });
});

describe('Calling getArg(nth)', function(){
    it('works like arguments[nth] for a specific call to the spy', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn(123, 456);
        expect(someObject.someFn.calls.forCall(0).getArg(0)).toEqual(123);
        expect(someObject.someFn.calls.forCall(0).getArg(1)).toEqual(456);
    });
});

describe('Calling getArgsLength()', function(){
    it('works like arguments.length for a specific call to the spy', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn(123, 456);
        expect(someObject.someFn.calls.forCall(0).getArgsLength()).toEqual(2);
    });
});

describe('Calling getProperty(nth, propertyName)', function(){
    it('works like arguments[nth][propertyName] for a specific call to the spy', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn({fName: 'Abraham', lName: 'Lincoln'});
        expect(someObject.someFn.calls.forCall(0).getArgProperty(0, 'fName')).toEqual('Abraham');
        expect(someObject.someFn.calls.forCall(0).getArgProperty(0, 'lName')).toEqual('Lincoln');
    });
});

describe('Calling hasArgProperty(nth, propertyName)', function(){
    it('works like !!arguments[nth][propertyName] for a specific call to the _spy_', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn({fName: 'Abraham', lName: 'Lincoln'});
        expect(someObject.someFn.calls.forCall(0).hasArgProperty(0, 'fName')).toBeTrue();
        expect(someObject.someFn.calls.forCall(0).hasArgProperty(0, 'lName')).toBeTrue();
    });
});

describe('Calling hasArg(n)', function(){
    it('works like !!arguments[nth] for a specific call to the spy', function(){
        var someObject = {
            someFn: function(){}
        };
        spyOn(someObject, 'someFn');
        someObject.someFn('123', 123);
        expect(someObject.someFn.calls.forCall(0).hasArg(0)).toBeTrue();
        expect(someObject.someFn.calls.forCall(0).hasArg(1)).toBeTrue();
    });
});

describe('Calling getError()', function(){
    it('returns the error associated with a specific call to the spy', function(){
        var someObject = {
            someFn: function(number){return number + a;}
        };
        spyOn(someObject, 'someFn').and.callActual();
        someObject.someFn(123);
        expect(someObject.someFn.calls.forCall(0).getError()).toBeTruthy();
    });
});

describe('Calling getReturned()', function(){
    it('returns the value returned from a specific call to the spy', function(){
        var someObject = {
            someFn: function(number){return number + 1;}
        };
        spyOn(someObject, 'someFn').and.callActual();
        someObject.someFn(123);
        expect(someObject.someFn.calls.forCall(0).getReturned()).toEqual(124);
    });
});

describe('Calling getLength()', function(){
    it('works like arguments.length', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.forCall(0).getArgs().getLength()).toEqual(3);
    });
});

describe('Calling hasArg(n)', function(){
    it('works like !!arguments[nth]', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.forCall(0).getArgs().hasArg(2)).toBeTrue();
    });
});

describe('Calling getArg(n)', function(){
    it('works like arguments[nth]', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.forCall(0).getArgs().hasArg(2)).toBeTrue();
    });
});

describe('Calling hasArgProperty(nth, propertyName)', function(){
    it('works like !!arguments[nth][propertyName]', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.forCall(0).getArgs().hasArgProperty(2, 'zip')).toBeTrue();
    });
});

describe('Calling getArgProperty(nth, propertyName)', function(){
    it('works like arguments[nth][propertyName]', function(){
        var someFn = spyOn();
        someFn(123, 'abc', {zip: 55555});
        expect(someFn.calls.forCall(0).getArgs().getArgProperty(2, 'zip')).toEqual(55555);
    });
});

describe('Calling and.callWithContext(object)', function(){
    it('the spy is called using object as its context (this)', function(){
        var context = {},
            someFn = spyOn().and.callWithContext(context);
        someFn();
        expect(someFn).toHaveBeenCalledWithContext(context);
    });
});

describe('Calling and.throw()', function(){
    it('throws an exception when the _spy_ is called', function(){
        var someFn = spyOn().and.throw();
        someFn();
        expect(someFn).toHaveThrown();
    });
});

describe('Calling and.throwWithMessage(message)', function(){
    it('the spy throws an exception with message when it is called', function(){
        var someFn = spyOn().and.throwWithMessage('Whoops!');
        someFn();
        expect(someFn).toHaveThrownWithMessage('Whoops!');
    });
});

describe('Calling and.throwWithName(name)', function(){
    it('the spy throws an exception with name when it is called', function(){
        var someFn = spyOn().and.throwWithName('Error');
        someFn();
        expect(someFn).toHaveThrownWithName('Error');
    });
});

describe('Calling and.return(value)', function(){
    it('the spy returns value when it is called', function(){
        var someFn = spyOn().and.return({zip: 55555});
        someFn();
        expect(someFn).toHaveReturned({zip: 55555});
    });
});

describe('Calling and.callActual()', function(){
    it('the actual implementation is called when the spy is called', function(){
        var someFn = function(n){
                return n + 1;
            },
            stub;
       stub = spyOn(someFn).and.return(1);
       stub(100);
       expect(stub).toHaveReturned(1);
       stub.and.callActual();
       stub(100);
       expect(stub).toHaveReturned(101);
    });
});

describe('Calling and.callFake(fn)', function(){
    it('creates a fake with fn as its implementation', function(){
        var someObject = {
                someFn: function(){return false;}
            };
       spyOn(someObject, 'someFn').and.callFake(function(){return true;});
       someObject.someFn();
       expect(someObject.someFn).toHaveReturned(true);
    });
});

describe('Calling and.expect.it.toBeCalled()', function(){
    it('sets the expectation that the mock must be called', function(){
        var mock = spyOn().and.expect.it.toBeCalled();
        mock();
        mock.validate();
    });
});

describe('Calling and.expect.it.toBeCalledWith("abc", 123, {zip: "55555"})', function(){
    it('sets the expectation that the mock must be called with "abc", 123, {zip: "55555"}', function(){
        var mock = spyOn().and.expect.it.toBeCalledWith('abc', 123, {zip: '55555'});
        mock('abc', 123, {zip: '55555'});
        mock.validate();
    });
});

describe('Calling and.expect.it.toBeCalledWithContext(object)', function(){
    it('sets the expectation that the mock must be called with its context set to object', function(){
        var someObject = {
                someFn: function(){}
            },
            someOtherObject = {};
        someObject.someFn = someObject.someFn.bind(someOtherObject);
        spyOn(someObject, 'someFn').and.expect.it.toBeCalledWithContext(someObject);
        someObject.someFn();
        someObject.someFn.validate();
    });
});

describe('Calling and.expect.it.toReturn(value)', function(){
    it('sets the expectation that the mock must return value', function(){
        var someObject = {
                someFn: function(){return {fName: 'Tom', lName: 'Sawyer'};}
            };
        spyOn(someObject, 'someFn').and.callActual().
            and.expect.it.toReturn({fName: 'Tom', lName: 'Sawyer'});
        someObject.someFn();
        someObject.someFn.validate();
    });
});

describe('Calling and.expect.it.toThrow()', function(){
    it('sets the expectation that the mock must throw an exception when called', function(){
        var someObject = {
                someFn: function(){ throw new Error('Whoops!');}
            };
        spyOn(someObject, 'someFn').and.callActual().
            and.expect.it.toThrow();
        someObject.someFn();
        someObject.someFn.validate();
    });
});

describe('Calling and.expect.it.toThrowWithName(name)', function(){
    it('sets the expectation that the mock must throw an exception with name when called', function(){
        var someObject = {
                someFn: function(){}
            };
        spyOn(someObject, 'someFn').and.throwWithName('Error').
            and.expect.it.toThrowWithName('Error');
        someObject.someFn();
        someObject.someFn.validate();
    });
});

describe('Calling and.expect.it.toThrowWithMessage("Whoops!")', function(){
    it('sets the expectation that the mock must throw an exception with message when called', function(){
        var someObject = {
                someFn: function(){}
            };
        spyOn(someObject, 'someFn').and.throwWithMessage('Whoops!').
            and.expect.it.toThrowWithMessage('Whoops!'); someObject.someFn();
        someObject.someFn.validate();
    });
});
