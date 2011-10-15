describe("lsd", function() {
    it("should exist", function() {
        expect(window.Lsd).toBeDefined();
    });

    describe("instance with custom local storage", function() {
        it("should retain custom storage", function() {
            var mockStorage = {items:'[]'};
            var lsd = new window.Lsd(mockStorage);

            expect(lsd.storage).toEqual(mockStorage);
        });
    });

    describe("instance", function() {
        beforeEach(function() {
            window.localStorage.clear();
            this.lsd = new Lsd();
        });

        it("should have storage equal to window localStorage", function() {
            expect(this.lsd.storage).toEqual(window.localStorage);
        });

        it("should have an empty list of registered cache items", function() {
            expect(this.lsd.registeredItems).toEqual({});
        });

        describe("Registering a cache item", function() {
            it("should keep the details on the registered item", function() {
                var cacheMiss = function(callback) {};
                this.lsd.registerCache('some.key', cacheMiss, 61);

                expect(this.lsd.registeredItems['some.key']).toEqual({
                    key: 'some.key',
                    cacheMiss: cacheMiss,
                    duration: 61
                });
            });

            it("should throw when re-registering", function() {
                var cacheMiss = function(callback) {};
                this.lsd.registerCache('some.key', cacheMiss, 61);

                expect(function() { this.lsd.registerCache('some.key', cacheMiss, 61); }.bind(this))
                    .toThrow("Can't re-register cache item 'some.key'.");
            });
        });

        describe("Getting a cached item", function() {

            it("should re-run cache miss function to get expired item", function() {
                this.lsd.registerCache('some.key', function(callback) { callback('Hello World'); }, 0.00000001);

                var retrieved = null;
                this.lsd.get('some.key', function(data) {
                    retrieved = data;
                });

                this.lsd.registeredItems['some.key']['cacheMiss'] = function(callback) { callback('Something else'); };

                waits(100);

                retrieved = null;
                this.lsd.get('some.key', function(data) {
                    retrieved = data;
                });

                waitsFor(function() {
                    return retrieved != null;
                }, "Data was not retrieved from cache.", 100);

                runs(function () {
                    expect(retrieved).toEqual('Something else');
                });
            });
            it("should return cached item from cache", function() {
                this.lsd.registerCache('some.key', function(callback) { callback('Hello World'); }, 120);
                var retrieved = null;
                this.lsd.get('some.key', function(data) {
                    retrieved = data;
                });

                this.lsd.registeredItems['some.key']['cacheMiss'] = function(callback) { callback('Something else'); };

                retrieved = null;
                this.lsd.get('some.key', function(data) {
                    retrieved = data;
                });

                waitsFor(function() {
                    return retrieved != null;
                }, "Data was not retrieved from cache.", 100);

                runs(function () {
                    expect(retrieved).toEqual('Hello World');
                });
            });

            it("should return cached item asynchronously", function() {

                this.lsd.registerCache('some.key', function(callback) { callback('Hello World'); }, 1);
                var retrieved = null;
                this.lsd.get('some.key', function(data) {
                    retrieved = data;
                });

                waitsFor(function() {
                  return retrieved != null;
                }, "Data was never retrieved.", 10000);

                runs(function () {
                    expect(retrieved).toEqual('Hello World');
                    expect(this.lsd.cachedItems['some.key']['v']).toEqual('Hello World');
                });
            });
        });
    });

});
