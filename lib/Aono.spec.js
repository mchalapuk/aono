// Generated by CoffeeScript 2.2.2
(function() {
  var Aono, FakePromise, sinon;

  sinon = require("sinon");

  FakePromise = require("fake-promise").default;

  Aono = require("./Aono").default;

  describe("Aono", function() {
    var logger, mocks, testedFactory;
    mocks = {
      timeProvider: sinon.stub(),
      handler0: sinon.stub(),
      handler1: sinon.stub(),
      writeListener: sinon.spy(),
      errorListener: sinon.spy()
    };
    testedFactory = null;
    logger = null;
    beforeEach(function() {
      testedFactory = new Aono(mocks.timeProvider);
      testedFactory.on("write", mocks.writeListener);
      testedFactory.on("error", mocks.errorListener);
      return logger = testedFactory.getLogger("test");
    });
    afterEach(function() {
      mocks.timeProvider.resetHistory();
      mocks.timeProvider.resetBehavior();
      mocks.handler0.resetHistory();
      mocks.handler0.resetBehavior();
      mocks.handler1.resetHistory();
      mocks.handler1.resetBehavior();
      mocks.writeListener.resetHistory();
      return mocks.errorListener.resetHistory();
    });
    describe("given no handlers", function() {
      return it("logs without any problem", function() {
        return logger.log("mayday", "we are blind");
      });
    });
    return describe("given single handler", function() {
      beforeEach(function() {
        return testedFactory.addHandler(mocks.handler0);
      });
      describe("before any log entries", function() {
        return it("calling .retry throws", function() {
          return (function() {
            return testedFactory.retry();
          }).should.throw(".retry() must be called only after emitting 'error'");
        });
      });
      return describe("when after first log entry", function() {
        var promise0;
        promise0 = null;
        beforeEach(function() {
          mocks.timeProvider.returns(12345);
          promise0 = new FakePromise;
          mocks.handler0.returns(promise0);
          return logger.log("info", "first entry");
        });
        it("immediately passes proper log entry to the handler", function() {
          return mocks.handler0.should.have.callCount(1).and.have.been.calledWith([
            {
              timestamp: 12345,
              logger: "test",
              level: "info",
              message: "first entry",
              meta: {}
            }
          ]);
        });
        describe("and after second and third log entry", function() {
          beforeEach(function() {
            mocks.timeProvider.resetHistory().resetBehavior();
            mocks.timeProvider.onCall(0).returns(98765);
            mocks.timeProvider.onCall(1).returns(111111);
            mocks.handler0.resetHistory();
            logger.log("debug", "second entry");
            return logger.log("warn", "entry", {
              number: "three"
            });
          });
          it("does not pass second log entry to the handler", function() {
            return mocks.handler0.should.have.callCount(0);
          });
          return describe("and after first write successfully ends", function() {
            var promise1;
            promise1 = null;
            beforeEach(function() {
              mocks.handler0.resetBehavior();
              promise1 = new FakePromise;
              mocks.handler0.returns(promise1);
              promise0.setResult(void 0).resolve();
              return void 0; // not returning the promise
            });
            it("emits 'write' with first log entry", function() {
              return mocks.writeListener.should.have.callCount(1).and.have.been.calledWith([
                {
                  timestamp: 12345,
                  logger: "test",
                  level: "info",
                  message: "first entry",
                  meta: {}
                }
              ]);
            });
            it("passes second and third log to the handler", function() {
              return mocks.handler0.should.have.callCount(1).and.have.been.calledWith([
                {
                  timestamp: 98765,
                  logger: "test",
                  level: "debug",
                  message: "second entry",
                  meta: {}
                },
                {
                  timestamp: 111111,
                  logger: "test",
                  level: "warn",
                  message: "entry",
                  meta: {
                    number: "three"
                  }
                }
              ]);
            });
            return describe("and after second write successfully ends", function() {
              beforeEach(function() {
                mocks.handler0.resetHistory();
                mocks.writeListener.resetHistory();
                promise1.setResult(void 0).resolve();
                return void 0; // not returning the promise
              });
              it("emits 'write' with second and third log entry", function() {
                return mocks.writeListener.should.have.callCount(1).and.have.been.calledWith([
                  {
                    timestamp: 98765,
                    logger: "test",
                    level: "debug",
                    message: "second entry",
                    meta: {}
                  },
                  {
                    timestamp: 111111,
                    logger: "test",
                    level: "warn",
                    message: "entry",
                    meta: {
                      number: "three"
                    }
                  }
                ]);
              });
              return it("does not pass anything to the handler", function() {
                return mocks.handler0.should.have.callCount(0);
              });
            });
          });
        });
        describe("and after first write successfully ends", function() {
          var promise1;
          promise1 = null;
          beforeEach(function() {
            mocks.handler0.resetBehavior();
            promise1 = new FakePromise;
            mocks.handler0.returns(promise1);
            promise0.setResult(void 0).resolve();
            return void 0; // not returning the promise
          });
          it("calling .retry throws", function() {
            return (function() {
              return testedFactory.retry();
            }).should.throw(".retry() must be called only after emitting 'error'");
          });
          return describe("and after second log entry", function() {
            beforeEach(function() {
              mocks.timeProvider.resetHistory().resetBehavior();
              mocks.timeProvider.returns(98765);
              mocks.handler0.resetHistory();
              return logger.log("debug", "entry", {
                number: "two"
              });
            });
            return it("immediately passes second log entry to the handler", function() {
              return mocks.handler0.should.have.callCount(1).and.have.been.calledWith([
                {
                  timestamp: 98765,
                  logger: "test",
                  level: "debug",
                  message: "entry",
                  meta: {
                    number: "two"
                  }
                }
              ]);
            });
          });
        });
        return describe("and after first write fails", function() {
          var error;
          error = new Error("something went wrong");
          beforeEach(function() {
            promise0.reject(error).reject();
            return void 0; // not returning the promise
          });
          it("emits the error", function() {
            return mocks.errorListener.should.have.callCount(1).and.have.been.calledWith(error, [
              {
                timestamp: 12345,
                logger: "test",
                level: "info",
                message: "first entry",
                meta: {}
              }
            ]);
          });
          return describe("and after second log entry", function() {
            beforeEach(function() {
              mocks.timeProvider.resetHistory().resetBehavior();
              mocks.timeProvider.returns(98765);
              mocks.handler0.resetHistory();
              return logger.log("debug", "entry", {
                number: "two"
              });
            });
            it("does not pass second log entry to the handler", function() {
              return mocks.handler0.should.have.callCount(0);
            });
            return describe("and after calling .retry", function() {
              var promise1;
              promise1 = null;
              beforeEach(function() {
                mocks.handler0.resetHistory();
                mocks.handler0.resetBehavior();
                promise1 = new FakePromise;
                mocks.handler0.returns(promise1);
                return testedFactory.retry();
              });
              return it("immediately passes the first log entry to the handler", function() {
                return mocks.handler0.should.have.callCount(1).and.have.been.calledWith([
                  {
                    timestamp: 12345,
                    logger: "test",
                    level: "info",
                    message: "first entry",
                    meta: {}
                  }
                ]);
              });
            });
          });
        });
      });
    });
  });

}).call(this);