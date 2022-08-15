/**
 * @fileoverview added by tsickle
 * Generated from: lib/theme.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as ɵngcc0 from '@angular/core';
export class ThemeService {
    constructor() {
        this.pColorschemesOptions = {};
        this.colorschemesOptions = new BehaviorSubject({});
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setColorschemesOptions(options) {
        this.pColorschemesOptions = options;
        this.colorschemesOptions.next(options);
    }
    /**
     * @return {?}
     */
    getColorschemesOptions() {
        return this.pColorschemesOptions;
    }
}
ThemeService.ɵfac = function ThemeService_Factory(t) { return new (t || ThemeService)(); };
/** @nocollapse */
ThemeService.ctorParameters = () => [];
/** @nocollapse */ ThemeService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ThemeService_Factory() { return new ThemeService(); }, token: ThemeService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ThemeService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
if (false) {
    /**
     * @type {?}
     * @private
     */
    ThemeService.prototype.pColorschemesOptions;
    /** @type {?} */
    ThemeService.prototype.colorschemesOptions;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2VydmljZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmcyLWNoYXJ0cy9zcmMvbGliL3RoZW1lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkM7O0FBS0EsTUFBTSxPQUFPLFlBQVk7QUFDekIsSUFHRTtBQUFnQixRQUhSLHlCQUFvQixHQUFpQixFQUFFLENBQUM7QUFDbEQsUUFBUyx3QkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBZSxFQUFFLENBQUMsQ0FBQztBQUNyRSxJQUNrQixDQUFDO0FBQ25CO0FBQ087QUFBMEI7QUFBbUI7QUFDaEQsSUFERixzQkFBc0IsQ0FBQyxPQUFxQjtBQUFJLFFBQzlDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUM7QUFDeEMsUUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBbUI7QUFBUSxJQUFoQyxzQkFBc0I7QUFBSyxRQUN6QixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztBQUNyQyxJQUFFLENBQUM7QUFDSDt3Q0FqQkMsVUFBVSxTQUFDLGtCQUNWLFVBQVUsRUFBRSxFQUVUO0dBRmUsY0FDbkIsakJBQ0s7QUFBbUI7QUFDWTs7Ozs7O2dEQU1uQjtBQUFDO0FBQWE7QUFBUTtBQUN4QjtBQUFnQjtBQUFRLElBUHRDLDRDQUFnRDtBQUNsRDtBQUFxQixJQUFuQiwyQ0FBbUU7O0FBVEEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFNQSxBQUFBLEFBQUEsQUFBQSxBQUlBLEFBSEEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFoQkEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFDQSxBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2hhcnRPcHRpb25zIH0gZnJvbSAnY2hhcnQuanMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGhlbWVTZXJ2aWNlIHtcclxuICBwcml2YXRlIHBDb2xvcnNjaGVtZXNPcHRpb25zOiBDaGFydE9wdGlvbnMgPSB7fTtcclxuICBwdWJsaWMgY29sb3JzY2hlbWVzT3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2hhcnRPcHRpb25zPih7fSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIHNldENvbG9yc2NoZW1lc09wdGlvbnMob3B0aW9uczogQ2hhcnRPcHRpb25zKTogdm9pZCB7XHJcbiAgICB0aGlzLnBDb2xvcnNjaGVtZXNPcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMuY29sb3JzY2hlbWVzT3B0aW9ucy5uZXh0KG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sb3JzY2hlbWVzT3B0aW9ucygpOiBDaGFydE9wdGlvbnMge1xyXG4gICAgcmV0dXJuIHRoaXMucENvbG9yc2NoZW1lc09wdGlvbnM7XHJcbiAgfVxyXG59XHJcbiJdfQ==