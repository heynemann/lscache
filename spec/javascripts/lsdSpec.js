describe("lsd", function() {
    it("should exist", function() {
        expect(window.Lsd).toBeDefined();
    });

    describe("instance with custom local storage", function() {
        it("should retain custom storage", function() {
            var mockStorage = 'mock storage';
            var lsd = new window.Lsd(mockStorage);

            expect(lsd.storage).toEqual(mockStorage);
        });
    });

    describe("instance", function() {
        beforeEach(function() {
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

            it("should rais when re-registering", function() {
                var cacheMiss = function(callback) {};
                this.lsd.registerCache('some.key', cacheMiss, 61);

                expect(function() { this.lsd.registerCache('some.key', cacheMiss, 61); }.bind(this))
                    .toThrow("Can't re-register cache item 'some.key'.");
            });
        });

        describe("Getting a cached item", function() {

        });
    });

});
