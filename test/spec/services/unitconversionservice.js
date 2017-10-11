'use strict';

describe('Service: UnitConversionService', function () {

    // load the service's module
    beforeEach(module('App'));

    // instantiate service
    var UnitConversionService;
    beforeEach(inject(function (_UnitConversionService_) {
        UnitConversionService = _UnitConversionService_;
    }));

    it('should do something', function () {
        expect(!!UnitConversionService).toBe(true);
    });

});
