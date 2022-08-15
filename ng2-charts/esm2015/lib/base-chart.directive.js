/**
 * @fileoverview added by tsickle
 * Generated from: lib/base-chart.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { getColors } from './get-colors';
import { ThemeService } from './theme.service';
import { cloneDeep } from 'lodash-es';
import { Chart, pluginService } from 'chart.js';
/**
 * @record
 */
import * as ɵngcc0 from '@angular/core';
function OldState() { }
if (false) {
    /** @type {?} */
    OldState.prototype.dataExists;
    /** @type {?} */
    OldState.prototype.dataLength;
    /** @type {?} */
    OldState.prototype.datasetsExists;
    /** @type {?} */
    OldState.prototype.datasetsLength;
    /** @type {?} */
    OldState.prototype.datasetsDataObjects;
    /** @type {?} */
    OldState.prototype.datasetsDataLengths;
    /** @type {?} */
    OldState.prototype.colorsExists;
    /** @type {?} */
    OldState.prototype.colors;
    /** @type {?} */
    OldState.prototype.labelsExist;
    /** @type {?} */
    OldState.prototype.labels;
    /** @type {?} */
    OldState.prototype.legendExists;
    /** @type {?} */
    OldState.prototype.legend;
}
/** @enum {number} */
const UpdateType = {
    Default: 0,
    Update: 1,
    Refresh: 2,
};
UpdateType[UpdateType.Default] = 'Default';
UpdateType[UpdateType.Update] = 'Update';
UpdateType[UpdateType.Refresh] = 'Refresh';
export class BaseChartDirective {
    /**
     * @param {?} element
     * @param {?} themeService
     */
    constructor(element, themeService) {
        this.element = element;
        this.themeService = themeService;
        this.options = {};
        this.chartClick = new EventEmitter();
        this.chartHover = new EventEmitter();
        this.old = {
            dataExists: false,
            dataLength: 0,
            datasetsExists: false,
            datasetsLength: 0,
            datasetsDataObjects: [],
            datasetsDataLengths: [],
            colorsExists: false,
            colors: [],
            labelsExist: false,
            labels: [],
            legendExists: false,
            legend: {},
        };
        this.subs = [];
    }
    /**
     * Register a plugin.
     * @param {?} plugin
     * @return {?}
     */
    static registerPlugin(plugin) {
        pluginService.register(plugin);
    }
    /**
     * @param {?} plugin
     * @return {?}
     */
    static unregisterPlugin(plugin) {
        pluginService.unregister(plugin);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.ctx = this.element.nativeElement.getContext('2d');
        this.refresh();
        this.subs.push(this.themeService.colorschemesOptions.subscribe((/**
         * @param {?} r
         * @return {?}
         */
        r => this.themeChanged(r))));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    themeChanged(options) {
        this.refresh();
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (!this.chart) {
            return;
        }
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        if (!!this.data !== this.old.dataExists) {
            this.propagateDataToDatasets(this.data);
            this.old.dataExists = !!this.data;
            wantUpdate(UpdateType.Update);
        }
        if (this.data && this.data.length !== this.old.dataLength) {
            this.old.dataLength = this.data && this.data.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (!!this.datasets !== this.old.datasetsExists) {
            this.old.datasetsExists = !!this.datasets;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.length !== this.old.datasetsLength) {
            this.old.datasetsLength = this.datasets && this.datasets.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data !== this.old.datasetsDataObjects[i])).length) {
            this.old.datasetsDataObjects = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data));
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data.length !== this.old.datasetsDataLengths[i])).length) {
            this.old.datasetsDataLengths = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data.length));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.colors !== this.old.colorsExists) {
            this.old.colorsExists = !!this.colors;
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        // This smells of inefficiency, might need to revisit this
        if (this.colors && this.colors.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.colorsEqual(x, this.old.colors[i]))).length) {
            this.old.colors = this.colors.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyColor(x)));
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        if (!!this.labels !== this.old.labelsExist) {
            this.old.labelsExist = !!this.labels;
            wantUpdate(UpdateType.Update);
        }
        if (this.labels && this.labels.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.labelsEqual(x, this.old.labels[i]))).length) {
            this.old.labels = this.labels.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyLabel(x)));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.options.legend !== this.old.legendExists) {
            this.old.legendExists = !!this.options.legend;
            wantUpdate(UpdateType.Refresh);
        }
        if (this.options.legend && this.options.legend.position !== this.old.legend.position) {
            this.old.legend.position = this.options.legend.position;
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Default:
                break;
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
                this.refresh();
                break;
        }
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyLabel(a) {
        if (Array.isArray(a)) {
            return [...a];
        }
        return a;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    labelsEqual(a, b) {
        return Array.isArray(a) === Array.isArray(b)
            && (Array.isArray(a) || a === b)
            && (!Array.isArray(a) || a.length === b.length)
            && (!Array.isArray(a) || a.filter((/**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */
            (x, i) => x !== b[i])).length === 0);
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyColor(a) {
        return {
            backgroundColor: a.backgroundColor,
            borderWidth: a.borderWidth,
            borderColor: a.borderColor,
            borderCapStyle: a.borderCapStyle,
            borderDash: a.borderDash,
            borderDashOffset: a.borderDashOffset,
            borderJoinStyle: a.borderJoinStyle,
            pointBorderColor: a.pointBorderColor,
            pointBackgroundColor: a.pointBackgroundColor,
            pointBorderWidth: a.pointBorderWidth,
            pointRadius: a.pointRadius,
            pointHoverRadius: a.pointHoverRadius,
            pointHitRadius: a.pointHitRadius,
            pointHoverBackgroundColor: a.pointHoverBackgroundColor,
            pointHoverBorderColor: a.pointHoverBorderColor,
            pointHoverBorderWidth: a.pointHoverBorderWidth,
            pointStyle: a.pointStyle,
            hoverBackgroundColor: a.hoverBackgroundColor,
            hoverBorderColor: a.hoverBorderColor,
            hoverBorderWidth: a.hoverBorderWidth,
        };
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    colorsEqual(a, b) {
        if (!a !== !b) {
            return false;
        }
        return !a ||
            (a.backgroundColor === b.backgroundColor)
                && (a.borderWidth === b.borderWidth)
                && (a.borderColor === b.borderColor)
                && (a.borderCapStyle === b.borderCapStyle)
                && (a.borderDash === b.borderDash)
                && (a.borderDashOffset === b.borderDashOffset)
                && (a.borderJoinStyle === b.borderJoinStyle)
                && (a.pointBorderColor === b.pointBorderColor)
                && (a.pointBackgroundColor === b.pointBackgroundColor)
                && (a.pointBorderWidth === b.pointBorderWidth)
                && (a.pointRadius === b.pointRadius)
                && (a.pointHoverRadius === b.pointHoverRadius)
                && (a.pointHitRadius === b.pointHitRadius)
                && (a.pointHoverBackgroundColor === b.pointHoverBackgroundColor)
                && (a.pointHoverBorderColor === b.pointHoverBorderColor)
                && (a.pointHoverBorderWidth === b.pointHoverBorderWidth)
                && (a.pointStyle === b.pointStyle)
                && (a.hoverBackgroundColor === b.hoverBackgroundColor)
                && (a.hoverBorderColor === b.hoverBorderColor)
                && (a.hoverBorderWidth === b.hoverBorderWidth);
    }
    /**
     * @return {?}
     */
    updateColors() {
        this.datasets.forEach((/**
         * @param {?} elm
         * @param {?} index
         * @return {?}
         */
        (elm, index) => {
            if (this.colors && this.colors[index]) {
                Object.assign(elm, this.colors[index]);
            }
            else {
                Object.assign(elm, getColors(this.chartType, index, elm.data.length), Object.assign({}, elm));
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        // Check if the changes are in the data or datasets or labels or legend
        if (changes.hasOwnProperty('data') && changes.data.currentValue) {
            this.propagateDataToDatasets(changes.data.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('datasets') && changes.datasets.currentValue) {
            this.propagateDatasetsToData(changes.datasets.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('labels')) {
            if (this.chart) {
                this.chart.data.labels = changes.labels.currentValue;
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('legend')) {
            if (this.chart) {
                this.chart.config.options.legend.display = changes.legend.currentValue;
                this.chart.generateLegend();
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('options')) {
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
            case UpdateType.Default:
                this.refresh();
                break;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        this.subs.forEach((/**
         * @param {?} x
         * @return {?}
         */
        x => x.unsubscribe()));
    }
    /**
     * @param {?=} duration
     * @return {?}
     */
    update(duration) {
        if (this.chart) {
            return this.chart.update(duration);
        }
    }
    /**
     * @param {?} index
     * @param {?} hidden
     * @return {?}
     */
    hideDataset(index, hidden) {
        this.chart.getDatasetMeta(index).hidden = hidden;
        this.chart.update();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    isDatasetHidden(index) {
        return this.chart.getDatasetMeta(index).hidden;
    }
    /**
     * @return {?}
     */
    toBase64Image() {
        return this.chart.toBase64Image();
    }
    /**
     * @return {?}
     */
    getChartConfiguration() {
        /** @type {?} */
        const datasets = this.getDatasets();
        /** @type {?} */
        const options = Object.assign({}, this.options);
        if (this.legend === false) {
            options.legend = { display: false };
        }
        // hook for onHover and onClick events
        options.hover = options.hover || {};
        if (!options.hover.onHover) {
            options.hover.onHover = (/**
             * @param {?} event
             * @param {?} active
             * @return {?}
             */
            (event, active) => {
                if (active && !active.length) {
                    return;
                }
                this.chartHover.emit({ event, active });
            });
        }
        if (!options.onClick) {
            options.onClick = (/**
             * @param {?=} event
             * @param {?=} active
             * @return {?}
             */
            (event, active) => {
                this.chartClick.emit({ event, active });
            });
        }
        /** @type {?} */
        const mergedOptions = this.smartMerge(options, this.themeService.getColorschemesOptions());
        return {
            type: this.chartType,
            data: {
                labels: this.labels || [],
                datasets
            },
            plugins: this.plugins,
            options: mergedOptions,
        };
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getChartBuilder(ctx /*, data:any[], options:any*/) {
        /** @type {?} */
        const chartConfig = this.getChartConfiguration();
        return new Chart(ctx, chartConfig);
    }
    /**
     * @param {?} options
     * @param {?} overrides
     * @param {?=} level
     * @return {?}
     */
    smartMerge(options, overrides, level = 0) {
        if (level === 0) {
            options = cloneDeep(options);
        }
        /** @type {?} */
        const keysToUpdate = Object.keys(overrides);
        keysToUpdate.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            if (Array.isArray(overrides[key])) {
                /** @type {?} */
                const arrayElements = options[key];
                if (arrayElements) {
                    arrayElements.forEach((/**
                     * @param {?} r
                     * @return {?}
                     */
                    r => {
                        this.smartMerge(r, overrides[key][0], level + 1);
                    }));
                }
            }
            else if (typeof (overrides[key]) === 'object') {
                if (!(key in options)) {
                    options[key] = {};
                }
                this.smartMerge(options[key], overrides[key], level + 1);
            }
            else {
                options[key] = overrides[key];
            }
        }));
        if (level === 0) {
            return options;
        }
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    isMultiLineLabel(label) {
        return Array.isArray(label);
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    joinLabel(label) {
        if (!label) {
            return null;
        }
        if (this.isMultiLineLabel(label)) {
            return label.join(' ');
        }
        else {
            return label;
        }
    }
    /**
     * @private
     * @param {?} datasets
     * @return {?}
     */
    propagateDatasetsToData(datasets) {
        this.data = this.datasets.map((/**
         * @param {?} r
         * @return {?}
         */
        r => r.data));
        if (this.chart) {
            this.chart.data.datasets = datasets;
        }
        this.updateColors();
    }
    /**
     * @private
     * @param {?} newDataValues
     * @return {?}
     */
    propagateDataToDatasets(newDataValues) {
        if (this.isMultiDataSet(newDataValues)) {
            if (this.datasets && newDataValues.length === this.datasets.length) {
                this.datasets.forEach((/**
                 * @param {?} dataset
                 * @param {?} i
                 * @return {?}
                 */
                (dataset, i) => {
                    dataset.data = newDataValues[i];
                }));
            }
            else {
                this.datasets = newDataValues.map((/**
                 * @param {?} data
                 * @param {?} index
                 * @return {?}
                 */
                (data, index) => {
                    return { data, label: this.joinLabel(this.labels[index]) || `Label ${index}` };
                }));
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
        }
        else {
            if (!this.datasets) {
                this.datasets = [{ data: newDataValues }];
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
            else {
                if (!this.datasets[0]) {
                    this.datasets[0] = {};
                }
                this.datasets[0].data = newDataValues;
                this.datasets.splice(1); // Remove all elements but the first
            }
        }
        this.updateColors();
    }
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    isMultiDataSet(data) {
        return Array.isArray(data[0]);
    }
    /**
     * @private
     * @return {?}
     */
    getDatasets() {
        if (!this.datasets && !this.data) {
            throw new Error(`ng-charts configuration error, data or datasets field are required to render chart ${this.chartType}`);
        }
        // If `datasets` is defined, use it over the `data` property.
        if (this.datasets) {
            this.propagateDatasetsToData(this.datasets);
            return this.datasets;
        }
        if (this.data) {
            this.propagateDataToDatasets(this.data);
            return this.datasets;
        }
    }
    /**
     * @private
     * @return {?}
     */
    refresh() {
        // if (this.options && this.options.responsive) {
        //   setTimeout(() => this.refresh(), 50);
        // }
        // todo: remove this line, it is producing flickering
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        if (this.ctx) {
            this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
        }
    }
}
BaseChartDirective.ɵfac = function BaseChartDirective_Factory(t) { return new (t || BaseChartDirective)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef), ɵngcc0.ɵɵdirectiveInject(ThemeService)); };
BaseChartDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: BaseChartDirective, selectors: [["canvas", "baseChart", ""]], inputs: { options: "options", data: "data", datasets: "datasets", labels: "labels", chartType: "chartType", colors: "colors", legend: "legend", plugins: "plugins" }, outputs: { chartClick: "chartClick", chartHover: "chartHover" }, exportAs: ["base-chart"], features: [ɵngcc0.ɵɵNgOnChangesFeature] });
/** @nocollapse */
BaseChartDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ThemeService }
];
BaseChartDirective.propDecorators = {
    data: [{ type: Input }],
    datasets: [{ type: Input }],
    labels: [{ type: Input }],
    options: [{ type: Input }],
    chartType: [{ type: Input }],
    colors: [{ type: Input }],
    legend: [{ type: Input }],
    plugins: [{ type: Input }],
    chartClick: [{ type: Output }],
    chartHover: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BaseChartDirective, [{
        type: Directive,
        args: [{
                // tslint:disable-next-line:directive-selector
                selector: 'canvas[baseChart]',
                exportAs: 'base-chart'
            }]
    }], function () { return [{ type: ɵngcc0.ElementRef }, { type: ThemeService }]; }, { options: [{
            type: Input
        }], chartClick: [{
            type: Output
        }], chartHover: [{
            type: Output
        }], data: [{
            type: Input
        }], datasets: [{
            type: Input
        }], labels: [{
            type: Input
        }], chartType: [{
            type: Input
        }], colors: [{
            type: Input
        }], legend: [{
            type: Input
        }], plugins: [{
            type: Input
        }] }); })();
if (false) {
    /** @type {?} */
    BaseChartDirective.prototype.data;
    /** @type {?} */
    BaseChartDirective.prototype.datasets;
    /** @type {?} */
    BaseChartDirective.prototype.labels;
    /** @type {?} */
    BaseChartDirective.prototype.options;
    /** @type {?} */
    BaseChartDirective.prototype.chartType;
    /** @type {?} */
    BaseChartDirective.prototype.colors;
    /** @type {?} */
    BaseChartDirective.prototype.legend;
    /** @type {?} */
    BaseChartDirective.prototype.plugins;
    /** @type {?} */
    BaseChartDirective.prototype.chartClick;
    /** @type {?} */
    BaseChartDirective.prototype.chartHover;
    /** @type {?} */
    BaseChartDirective.prototype.ctx;
    /** @type {?} */
    BaseChartDirective.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.old;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.subs;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.themeService;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jaGFydHMvc3JjL2xpYi9iYXNlLWNoYXJ0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFFTCxTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUNMLEtBQUssRUFPTCxhQUFhLEVBQ2QsTUFBTSxVQUFVLENBQUM7QUFDbEI7QUFDRztBQUFXOztBQVdkLHVCQWVDO0FBQ0Q7QUFDWTtBQUVSLElBbEJGLDhCQUFvQjtBQUN0QjtBQUFxQixJQUFuQiw4QkFBbUI7QUFDckI7QUFBcUIsSUFBbkIsa0NBQXdCO0FBQzFCO0FBQXFCLElBQW5CLGtDQUF1QjtBQUN6QjtBQUFxQixJQUFuQix1Q0FBMkI7QUFDN0I7QUFBcUIsSUFBbkIsdUNBQThCO0FBQ2hDO0FBQXFCLElBQW5CLGdDQUFzQjtBQUN4QjtBQUNFLElBREEsMEJBQWdCO0FBQ2xCO0FBQXFCLElBQW5CLCtCQUFxQjtBQUN2QjtBQUNFLElBREEsMEJBQWdCO0FBQ2xCO0FBQXFCLElBQW5CLGdDQUFzQjtBQUN4QjtBQUNTLElBRFAsMEJBRUU7QUFDSjtBQUNBO0FBQ0EsTUFBSyxVQUFVO0FBQ2IsSUFBQSxPQUFPLEdBQUE7QUFDVCxJQUFFLE1BQU0sR0FBQTtBQUNSLElBQUUsT0FBTyxHQUFBO0FBQ1IsRUFBQTtBQUNEO0FBRThCO0FBQ1A7QUFHdkIsTUFBTSxPQUFPLGtCQUFrQjtBQUFHO0FBQVE7QUFBMEI7QUFDcEQ7QUFBUSxJQTJDdEIsWUFDVSxPQUFtQixFQUNuQixZQUEwQjtBQUNwQyxRQUZVLFlBQU8sR0FBUCxPQUFPLENBQVk7QUFBQyxRQUNwQixpQkFBWSxHQUFaLFlBQVksQ0FBYztBQUFDLFFBMUNyQixZQUFPLEdBQWlCLEVBQUUsQ0FBQztBQUM3QyxRQUttQixlQUFVLEdBQXdELElBQUksWUFBWSxFQUFFLENBQUM7QUFDeEcsUUFBbUIsZUFBVSxHQUFzRCxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQ3RHLFFBSVUsUUFBRyxHQUFhO0FBQzFCLFlBQUksVUFBVSxFQUFFLEtBQUs7QUFDckIsWUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNqQixZQUFJLGNBQWMsRUFBRSxLQUFLO0FBQ3pCLFlBQUksY0FBYyxFQUFFLENBQUM7QUFDckIsWUFBSSxtQkFBbUIsRUFBRSxFQUFFO0FBQzNCLFlBQUksbUJBQW1CLEVBQUUsRUFBRTtBQUMzQixZQUFJLFlBQVksRUFBRSxLQUFLO0FBQ3ZCLFlBQUksTUFBTSxFQUFFLEVBQUU7QUFDZCxZQUFJLFdBQVcsRUFBRSxLQUFLO0FBQ3RCLFlBQUksTUFBTSxFQUFFLEVBQUU7QUFDZCxZQUFJLFlBQVksRUFBRSxLQUFLO0FBQ3ZCLFlBQUksTUFBTSxFQUFFLEVBQUU7QUFDZCxTQUFHLENBQUM7QUFDSixRQUNVLFNBQUksR0FBbUIsRUFBRSxDQUFDO0FBQ3BDLElBZU0sQ0FBQztBQUNQO0FBQ087QUFDRjtBQUF5QjtBQUFtQjtBQUFRLElBZGhELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBaUQ7QUFBSSxRQUNoRixhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBeUI7QUFBbUI7QUFBUSxJQUFsRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBaUQ7QUFBSSxRQUNsRixhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLElBQUUsQ0FBQztBQUNIO0FBQ087QUFDSDtBQUFRLElBSUgsUUFBUTtBQUFLLFFBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25CLFFBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO0FBQU07QUFDeEU7QUFFa0I7QUFBWSxRQUhxQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQy9GLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBZ0I7QUFDbEI7QUFFTDtBQUNPLElBSkcsWUFBWSxDQUFDLE9BQVc7QUFBSSxRQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkIsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUNIO0FBQVEsSUFEVixTQUFTO0FBQUssUUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNyQixZQUFNLE9BQU87QUFDYixTQUFLO0FBQ0w7QUFBeUIsWUFBakIsY0FBYyxHQUFHLFVBQVUsQ0FBQyxPQUFPO0FBQzNDO0FBQXlCLGNBQWYsVUFBVTtBQUFRO0FBQ3BCO0FBQXVCO0FBQVksUUFEcEIsQ0FBQyxDQUFhLEVBQUUsRUFBRTtBQUN6QyxZQUFNLGNBQWMsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztBQUMvRCxRQUFJLENBQUMsQ0FBQTtBQUNMLFFBQ0ksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRTtBQUM3QyxZQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsWUFDTSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN4QyxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBSztBQUNMLFFBQ0ksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFO0FBQy9ELFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDL0QsWUFDTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUNJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7QUFDckQsWUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNoRCxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBSztBQUNMLFFBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO0FBQzNFLFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDM0UsWUFDTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07QUFBTTtBQUF3QjtBQUF3QjtBQUN2RjtBQUFZLFFBRHNCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFFO0FBQzVHLFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFBTTtBQUUxQztBQUdqQjtBQUFnQixZQUxzQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQztBQUNwRSxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBSztBQUNMLFFBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtBQUFNO0FBQXdCO0FBQXdCO0FBQzlGO0FBQVksUUFENkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFFO0FBQ25ILFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFBTTtBQUVqRDtBQUNWO0FBRVMsWUFMNkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDO0FBQzNFLFlBQ00sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxTQUFLO0FBQ0wsUUFDSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO0FBQ2pELFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUMsWUFDTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDMUIsWUFDTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUNJLDBEQUEwRDtBQUM5RCxRQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07QUFBTTtBQUF3QjtBQUF3QjtBQUNqRjtBQUFZLFFBRGdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3RHLFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0FBQU07QUFFdEM7QUFFRDtBQUFnQixZQUprQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUNoRSxZQUNNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxQixZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBSztBQUNMLFFBQ0ksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtBQUNoRCxZQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNDLFlBQ00sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxTQUFLO0FBQ0wsUUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO0FBQU07QUFBd0I7QUFBd0I7QUFDakY7QUFBWSxRQURnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBRTtBQUN0RyxZQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztBQUFNO0FBRXRDO0FBQTJCO0FBRzVCLFlBTGtDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0FBQ2hFLFlBQ00sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxTQUFLO0FBQ0wsUUFDSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtBQUN6RCxZQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNwRCxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsU0FBSztBQUNMLFFBQ0ksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQzFGLFlBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUM5RCxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsU0FBSztBQUNMLFFBQ0ksUUFBUSxtQkFBQSxjQUFjLEVBQWMsRUFBRTtBQUMxQyxZQUFNLEtBQUssVUFBVSxDQUFDLE9BQU87QUFDN0IsZ0JBQVEsTUFBTTtBQUNkLFlBQU0sS0FBSyxVQUFVLENBQUMsTUFBTTtBQUM1QixnQkFBUSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdEIsZ0JBQVEsTUFBTTtBQUNkLFlBQU0sS0FBSyxVQUFVLENBQUMsT0FBTztBQUM3QixnQkFBUSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsZ0JBQVEsTUFBTTtBQUNkLFNBQUs7QUFDTCxJQUFFLENBQUM7QUFDSDtBQUNPO0FBQW9CO0FBQ1o7QUFBUSxJQURyQixTQUFTLENBQUMsQ0FBUTtBQUFJLFFBQ3BCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMxQixZQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLFNBQUs7QUFDTCxRQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFvQjtBQUN6QjtBQUFtQjtBQUFRLElBRDNCLFdBQVcsQ0FBQyxDQUFRLEVBQUUsQ0FBUTtBQUFJLFFBQ2hDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoRCxlQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGVBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3JELGVBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07QUFBTTtBQUE0QjtBQUk3RDtBQUNKO0FBQ0csWUFONkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUNwRTtBQUNQLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBb0I7QUFFekI7QUFBUSxJQUZSLFNBQVMsQ0FBQyxDQUFRO0FBQUksUUFDcEIsT0FBTztBQUNYLFlBQU0sZUFBZSxFQUFFLENBQUMsQ0FBQyxlQUFlO0FBQ3hDLFlBQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXO0FBQ2hDLFlBQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXO0FBQ2hDLFlBQU0sY0FBYyxFQUFFLENBQUMsQ0FBQyxjQUFjO0FBQ3RDLFlBQU0sVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO0FBQzlCLFlBQU0sZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtBQUMxQyxZQUFNLGVBQWUsRUFBRSxDQUFDLENBQUMsZUFBZTtBQUN4QyxZQUFNLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7QUFDMUMsWUFBTSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsb0JBQW9CO0FBQ2xELFlBQU0sZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtBQUMxQyxZQUFNLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVztBQUNoQyxZQUFNLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7QUFDMUMsWUFBTSxjQUFjLEVBQUUsQ0FBQyxDQUFDLGNBQWM7QUFDdEMsWUFBTSx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCO0FBQzVELFlBQU0scUJBQXFCLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQjtBQUNwRCxZQUFNLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxxQkFBcUI7QUFDcEQsWUFBTSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVU7QUFDOUIsWUFBTSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsb0JBQW9CO0FBQ2xELFlBQU0sZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtBQUMxQyxZQUFNLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7QUFDMUMsU0FBSyxDQUFDO0FBQ04sSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFvQjtBQUN6QjtBQUNGO0FBQVEsSUFGTixXQUFXLENBQUMsQ0FBUSxFQUFFLENBQVE7QUFBSSxRQUNoQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ25CLFlBQU0sT0FBTyxLQUFLLENBQUM7QUFDbkIsU0FBSztBQUNMLFFBQUksT0FBTyxDQUFDLENBQUM7QUFDYixZQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO0FBQy9DLG1CQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzFDLG1CQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzFDLG1CQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDO0FBQ2hELG1CQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ3hDLG1CQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNwRCxtQkFBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztBQUNsRCxtQkFBUyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7QUFDcEQsbUJBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixDQUFDO0FBQzVELG1CQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNwRCxtQkFBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUMxQyxtQkFBUyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7QUFDcEQsbUJBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUM7QUFDaEQsbUJBQVMsQ0FBQyxDQUFDLENBQUMseUJBQXlCLEtBQUssQ0FBQyxDQUFDLHlCQUF5QixDQUFDO0FBQ3RFLG1CQUFTLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztBQUM5RCxtQkFBUyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUM7QUFDOUQsbUJBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDeEMsbUJBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixDQUFDO0FBQzVELG1CQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNwRCxtQkFBUyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNyRCxJQUFFLENBQUM7QUFDSDtBQUNPO0FBQ047QUFBUSxJQURQLFlBQVk7QUFBSyxRQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztBQUFNO0FBQ2xCO0FBQTRCO0FBQ3hCO0FBQVksUUFGSCxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN6QyxZQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdDLGdCQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMvQyxhQUFPO0FBQUMsaUJBQUs7QUFDYixnQkFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQU8sR0FBRyxFQUFHLENBQUM7QUFDMUYsYUFBTztBQUNQLFFBQUksQ0FBQyxFQUFDLENBQUM7QUFDUCxJQUFFLENBQUM7QUFDSDtBQUNPO0FBQTBCO0FBQW1CO0FBQzdDLElBREUsV0FBVyxDQUFDLE9BQXNCO0FBQUk7QUFDNUIsWUFBWCxjQUFjLEdBQUcsVUFBVSxDQUFDLE9BQU87QUFDM0M7QUFBeUIsY0FBZixVQUFVO0FBQVE7QUFDcEI7QUFBdUI7QUFBWSxRQURwQixDQUFDLENBQWEsRUFBRSxFQUFFO0FBQ3pDLFlBQU0sY0FBYyxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxDQUFBO0FBQ0wsUUFDSSx1RUFBdUU7QUFDM0UsUUFDSSxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckUsWUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5RCxZQUNNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBSztBQUNMLFFBQ0ksSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFO0FBQzdFLFlBQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEUsWUFDTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUNJLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxQyxZQUFNLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN0QixnQkFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDN0QsYUFBTztBQUNQLFlBQ00sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxTQUFLO0FBQ0wsUUFDSSxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDMUMsWUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDdEIsZ0JBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDL0UsZ0JBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwQyxhQUFPO0FBQ1AsWUFDTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUNJLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMzQyxZQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsU0FBSztBQUNMLFFBQ0ksUUFBUSxtQkFBQSxjQUFjLEVBQWMsRUFBRTtBQUMxQyxZQUFNLEtBQUssVUFBVSxDQUFDLE1BQU07QUFDNUIsZ0JBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLGdCQUFRLE1BQU07QUFDZCxZQUFNLEtBQUssVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUM5QixZQUFNLEtBQUssVUFBVSxDQUFDLE9BQU87QUFDN0IsZ0JBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLGdCQUFRLE1BQU07QUFDZCxTQUFLO0FBQ0wsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFtQjtBQUN2QixJQURNLFdBQVc7QUFBSyxRQUNyQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDcEIsWUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFlBQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMxQixTQUFLO0FBQ0wsUUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87QUFBTTtBQUcxQjtBQUF1QjtBQUFZLFFBSGQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUMsQ0FBQztBQUM1QyxJQUFFLENBQUM7QUFDSDtBQUNPO0FBQTRCO0FBQ25CO0FBQ2QsSUFGTyxNQUFNLENBQUMsUUFBYztBQUFJLFFBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQixZQUFNLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBd0I7QUFBeUI7QUFDMUM7QUFBUSxJQURiLFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBZTtBQUFJLFFBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckQsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3hCLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBd0I7QUFBbUI7QUFDM0MsSUFERSxlQUFlLENBQUMsS0FBYTtBQUFJLFFBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ25ELElBQUUsQ0FBQztBQUNIO0FBQ087QUFBbUI7QUFBUSxJQUF6QixhQUFhO0FBQUssUUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3RDLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBbUI7QUFBUSxJQUF6QixxQkFBcUI7QUFBSztBQUM5QixjQUFLLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3ZDO0FBQ3dCLGNBQWQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDbkQsUUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQy9CLFlBQU0sT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUMxQyxTQUFLO0FBQ0wsUUFBSSxzQ0FBc0M7QUFDMUMsUUFBSSxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ3hDLFFBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2hDLFlBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPO0FBQVE7QUFBZ0M7QUFDcEM7QUFFL0I7QUFDTSxZQUp3QixDQUFDLEtBQWlCLEVBQUUsTUFBWSxFQUFFLEVBQUU7QUFDbEUsZ0JBQVEsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3RDLG9CQUFVLE9BQU87QUFDakIsaUJBQVM7QUFDVCxnQkFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELFlBQU0sQ0FBQyxDQUFBLENBQUM7QUFDUixTQUFLO0FBQ0wsUUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUMxQixZQUFNLE9BQU8sQ0FBQyxPQUFPO0FBQVE7QUFBaUM7QUFDL0I7QUFFL0I7QUFFUyxZQUxlLENBQUMsS0FBa0IsRUFBRSxNQUFhLEVBQUUsRUFBRTtBQUM5RCxnQkFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELFlBQU0sQ0FBQyxDQUFBLENBQUM7QUFDUixTQUFLO0FBQ0w7QUFDd0IsY0FBZCxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0FBQzlGLFFBQ0ksT0FBTztBQUNYLFlBQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQzFCLFlBQU0sSUFBSSxFQUFFO0FBQ1osZ0JBQVEsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRTtBQUNqQyxnQkFBUSxRQUFRO0FBQ2hCLGFBQU87QUFDUCxZQUFNLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztBQUMzQixZQUFNLE9BQU8sRUFBRSxhQUFhO0FBQzVCLFNBQUssQ0FBQztBQUNOLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBc0I7QUFBbUI7QUFBUSxJQUEvQyxlQUFlLENBQUMsR0FBVyxDQUFBLDZCQUE2QjtBQUFJO0FBQ25ELGNBQVIsV0FBVyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtBQUNwRCxRQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBMEI7QUFBNEI7QUFDNUM7QUFDSjtBQUFRLElBRm5CLFVBQVUsQ0FBQyxPQUFZLEVBQUUsU0FBYyxFQUFFLFFBQWdCLENBQUM7QUFBSSxRQUM1RCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDckIsWUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLFNBQUs7QUFDTDtBQUF5QixjQUFmLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMvQyxRQUFJLFlBQVksQ0FBQyxPQUFPO0FBQU07QUFDUjtBQUNwQjtBQUFZLFFBRlcsR0FBRyxDQUFDLEVBQUU7QUFDL0IsWUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDekM7QUFBaUMsc0JBQW5CLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQzFDLGdCQUFRLElBQUksYUFBYSxFQUFFO0FBQzNCLG9CQUFVLGFBQWEsQ0FBQyxPQUFPO0FBQU07QUFDSDtBQUMzQjtBQUVBLG9CQUp5QixDQUFDLENBQUMsRUFBRTtBQUNwQyx3QkFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdELG9CQUFVLENBQUMsRUFBQyxDQUFDO0FBQ2IsaUJBQVM7QUFDVCxhQUFPO0FBQUMsaUJBQUssSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO0FBQ3ZELGdCQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRTtBQUMvQixvQkFBVSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVCLGlCQUFTO0FBQ1QsZ0JBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRSxhQUFPO0FBQUMsaUJBQUs7QUFDYixnQkFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLGFBQU87QUFDUCxRQUFJLENBQUMsRUFBQyxDQUFDO0FBQ1AsUUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDckIsWUFBTSxPQUFPLE9BQU8sQ0FBQztBQUNyQixTQUFLO0FBQ0wsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFnQjtBQUF3QjtBQUFtQjtBQUM1RCxJQURJLGdCQUFnQixDQUFDLEtBQVk7QUFBSSxRQUN2QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFnQjtBQUNwQjtBQUNDO0FBQVEsSUFGRixTQUFTLENBQUMsS0FBWTtBQUFJLFFBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDaEIsWUFBTSxPQUFPLElBQUksQ0FBQztBQUNsQixTQUFLO0FBQ0wsUUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN0QyxZQUFNLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixTQUFLO0FBQUMsYUFBSztBQUNYLFlBQU0sT0FBTyxLQUFLLENBQUM7QUFDbkIsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBZ0I7QUFBMkI7QUFDbEQ7QUFBUSxJQURFLHVCQUF1QixDQUFDLFFBQXlCO0FBQUksUUFDM0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFBTTtBQUN4QjtBQUNDO0FBQVksUUFGTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQztBQUMvQyxRQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQixZQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDMUMsU0FBSztBQUNMLFFBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3hCLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBZ0I7QUFBZ0M7QUFBbUI7QUFDdkUsSUFETyx1QkFBdUIsQ0FBQyxhQUFtQztBQUFJLFFBQ3JFLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUM1QyxZQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQzFFLGdCQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztBQUFNO0FBQ2xCO0FBQ1g7QUFFSTtBQUFvQixnQkFKQSxDQUFDLE9BQU8sRUFBRSxDQUFTLEVBQUUsRUFBRTtBQUNyRCxvQkFBVSxPQUFPLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBUSxDQUFDLEVBQUMsQ0FBQztBQUNYLGFBQU87QUFBQyxpQkFBSztBQUNiLGdCQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLEdBQUc7QUFBTTtBQUM1QztBQUFvQztBQUErQjtBQUN0RSxnQkFGMEMsQ0FBQyxJQUFjLEVBQUUsS0FBYSxFQUFFLEVBQUU7QUFDNUUsb0JBQVUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksU0FBUyxLQUFLLEVBQUUsRUFBRSxDQUFDO0FBQ3pGLGdCQUFRLENBQUMsRUFBQyxDQUFDO0FBQ1gsZ0JBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3hCLG9CQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ25ELGlCQUFTO0FBQ1QsYUFBTztBQUNQLFNBQUs7QUFBQyxhQUFLO0FBQ1gsWUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUMxQixnQkFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNsRCxnQkFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDeEIsb0JBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkQsaUJBQVM7QUFDVCxhQUFPO0FBQUMsaUJBQUs7QUFDYixnQkFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMvQixvQkFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxpQkFBUztBQUNULGdCQUNRLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztBQUM5QyxnQkFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztBQUNyRSxhQUFPO0FBQ1AsU0FBSztBQUNMLFFBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3hCLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBZ0I7QUFBdUI7QUFBbUI7QUFBUSxJQUEvRCxjQUFjLENBQUMsSUFBMEI7QUFBSSxRQUNuRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsSUFBRSxDQUFDO0FBQ0g7QUFDTztBQUFnQjtBQUFtQjtBQUN6QyxJQURTLFdBQVc7QUFBSyxRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDdEMsWUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLHNGQUF1RixJQUFJLENBQUMsU0FBVSxFQUFFLENBQUMsQ0FBQztBQUNoSSxTQUFLO0FBQ0wsUUFDSSw2REFBNkQ7QUFDakUsUUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDdkIsWUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzNCLFNBQUs7QUFDTCxRQUNJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNuQixZQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsWUFBTSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDM0IsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNIO0FBQ087QUFBZ0I7QUFDVDtBQUFRLElBRFosT0FBTztBQUFLLFFBQ2xCLGlEQUFpRDtBQUNyRCxRQUFJLDBDQUEwQztBQUM5QyxRQUFJLElBQUk7QUFDUixRQUNJLHFEQUFxRDtBQUN6RCxRQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQixZQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0IsWUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFNBQUs7QUFDTCxRQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNsQixZQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFBLHdCQUF3QixDQUFDLENBQUM7QUFDMUUsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNIOzhDQS9kQyxTQUFTLFNBQUMsaUZBRVQsUUFBUSxFQUFFLG1CQUFtQixrQkFDN0I7T0FBUSxFQUFFLFlBQVksY0FDdkIsa1lBQ0k7QUFBQztBQUFtQjtBQUE0QyxZQWhFbkUsVUFBVTtBQUNWLFlBVU8sWUFBWTtBQUFHO0FBQUc7QUFDVixtQkFxRGQsS0FBSztBQUFLLHVCQUNWLEtBQUs7QUFBSyxxQkFDVixLQUFLO0FBQUssc0JBQ1YsS0FBSztBQUFLLHdCQUNWLEtBQUs7QUFBSyxxQkFDVixLQUFLO0FBQUsscUJBQ1YsS0FBSztBQUFLLHNCQUNWLEtBQUs7QUFBSyx5QkFFVixNQUFNO0FBQUsseUJBQ1gsTUFBTTtBQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUFFO0FBQUM7QUFBYTtBQUFxQixJQVZoRCxrQ0FBMkM7QUFDN0M7QUFBcUIsSUFBbkIsc0NBQTBDO0FBQzVDO0FBQXFCLElBQW5CLG9DQUFnQztBQUNsQztBQUFxQixJQUFuQixxQ0FBMkM7QUFDN0M7QUFBcUIsSUFBbkIsdUNBQXFDO0FBQ3ZDO0FBQXFCLElBQW5CLG9DQUFnQztBQUNsQztBQUFxQixJQUFuQixvQ0FBZ0M7QUFDbEM7QUFBcUIsSUFBbkIscUNBQXFFO0FBQ3ZFO0FBQ29CLElBQWxCLHdDQUFzRztBQUN4RztBQUFxQixJQUFuQix3Q0FBb0c7QUFDdEc7QUFDb0IsSUFBbEIsaUNBQW1CO0FBQ3JCO0FBQXFCLElBQW5CLG1DQUFvQjtBQUN0QjtBQUNPO0FBQWlCO0FBQ1o7QUFBUSxJQURsQixpQ0FhRTtBQUNKO0FBQ087QUFBaUI7QUFFdEI7QUFDRSxJQUhGLGtDQUFrQztBQUNwQztBQUVDO0FBQWlCO0FBRWQ7QUFBUSxJQVNSLHFDQUEyQjtBQUFDO0FBQ3pCO0FBQWlCO0FBQ3hCO0FBQ0EsSUFGSSwwQ0FBa0M7O0FBbEhBLEFBQUEsQUFFQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBSUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFPQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFhQSxBQWVBLEFBZEEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUVBLEFBR0EsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQ0EsQUFPQSxBQUFBLEFBQUEsQUFBQSxBQTRDQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBREEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUExQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQU1BLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFLQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQWdCQSxBQUFBLEFBWEEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQU9BLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBRUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFFQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUNBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFDQSxBQUFBLEFBOWRBLEFBQUEsQUFBQSxBQUVBLEFBQUEsQUFBQSxBQUFBLEFBQ0EsQUFBQSxBQUFBLEFBQUEsQUFDQSxBQS9EQSxBQUFBLEFBV0EsQUFBQSxBQXNEQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFDQSxBQUFBLEFBVkEsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFDQSxBQUFBLEFBQ0EsQUFBQSxBQUNBLEFBQUEsQUFFQSxBQUFBLEFBQ0EsQUFBQSxBQUVBLEFBQUEsQUFDQSxBQUFBLEFBRUEsQUFhQSxBQUVBLEFBQUEsQUFjQSxBQUFBLEFBQ0EsQUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBEaXJlY3RpdmUsXHJcbiAgRG9DaGVjayxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBPbkNoYW5nZXMsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi9nZXQtY29sb3JzJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuL2NvbG9yJztcclxuaW1wb3J0IHsgVGhlbWVTZXJ2aWNlIH0gZnJvbSAnLi90aGVtZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcbmltcG9ydCB7XHJcbiAgQ2hhcnQsXHJcbiAgQ2hhcnRDb25maWd1cmF0aW9uLFxyXG4gIENoYXJ0RGF0YVNldHMsXHJcbiAgQ2hhcnRPcHRpb25zLFxyXG4gIENoYXJ0UG9pbnQsIENoYXJ0VHlwZSxcclxuICBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uLFxyXG4gIFBsdWdpblNlcnZpY2VSZWdpc3RyYXRpb25PcHRpb25zLFxyXG4gIHBsdWdpblNlcnZpY2VcclxufSBmcm9tICdjaGFydC5qcyc7XHJcblxyXG5leHBvcnQgdHlwZSBTaW5nbGVEYXRhU2V0ID0gQXJyYXk8bnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCB8IG51bWJlcltdPiB8IENoYXJ0UG9pbnRbXTtcclxuZXhwb3J0IHR5cGUgTXVsdGlEYXRhU2V0ID0gU2luZ2xlRGF0YVNldFtdO1xyXG5leHBvcnQgdHlwZSBTaW5nbGVPck11bHRpRGF0YVNldCA9IFNpbmdsZURhdGFTZXQgfCBNdWx0aURhdGFTZXQ7XHJcblxyXG5leHBvcnQgdHlwZSBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9ucyA9XHJcbiAgUGx1Z2luU2VydmljZUdsb2JhbFJlZ2lzdHJhdGlvblxyXG4gICYgUGx1Z2luU2VydmljZVJlZ2lzdHJhdGlvbk9wdGlvbnM7XHJcbmV4cG9ydCB0eXBlIFNpbmdsZUxpbmVMYWJlbCA9IHN0cmluZztcclxuZXhwb3J0IHR5cGUgTXVsdGlMaW5lTGFiZWwgPSBzdHJpbmdbXTtcclxuZXhwb3J0IHR5cGUgTGFiZWwgPSBTaW5nbGVMaW5lTGFiZWwgfCBNdWx0aUxpbmVMYWJlbDtcclxuXHJcbmludGVyZmFjZSBPbGRTdGF0ZSB7XHJcbiAgZGF0YUV4aXN0czogYm9vbGVhbjtcclxuICBkYXRhTGVuZ3RoOiBudW1iZXI7XHJcbiAgZGF0YXNldHNFeGlzdHM6IGJvb2xlYW47XHJcbiAgZGF0YXNldHNMZW5ndGg6IG51bWJlcjtcclxuICBkYXRhc2V0c0RhdGFPYmplY3RzOiBhbnlbXTtcclxuICBkYXRhc2V0c0RhdGFMZW5ndGhzOiBudW1iZXJbXTtcclxuICBjb2xvcnNFeGlzdHM6IGJvb2xlYW47XHJcbiAgY29sb3JzOiBDb2xvcltdO1xyXG4gIGxhYmVsc0V4aXN0OiBib29sZWFuO1xyXG4gIGxhYmVsczogTGFiZWxbXTtcclxuICBsZWdlbmRFeGlzdHM6IGJvb2xlYW47XHJcbiAgbGVnZW5kOiB7XHJcbiAgICBwb3NpdGlvbj86IHN0cmluZztcclxuICB9O1xyXG59XHJcblxyXG5lbnVtIFVwZGF0ZVR5cGUge1xyXG4gIERlZmF1bHQsXHJcbiAgVXBkYXRlLFxyXG4gIFJlZnJlc2hcclxufVxyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxyXG4gIHNlbGVjdG9yOiAnY2FudmFzW2Jhc2VDaGFydF0nLFxyXG4gIGV4cG9ydEFzOiAnYmFzZS1jaGFydCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEJhc2VDaGFydERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3ksIERvQ2hlY2sge1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBkYXRhOiBTaW5nbGVPck11bHRpRGF0YVNldDtcclxuICBASW5wdXQoKSBwdWJsaWMgZGF0YXNldHM6IENoYXJ0RGF0YVNldHNbXTtcclxuICBASW5wdXQoKSBwdWJsaWMgbGFiZWxzOiBMYWJlbFtdO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBvcHRpb25zOiBDaGFydE9wdGlvbnMgPSB7fTtcclxuICBASW5wdXQoKSBwdWJsaWMgY2hhcnRUeXBlOiBDaGFydFR5cGU7XHJcbiAgQElucHV0KCkgcHVibGljIGNvbG9yczogQ29sb3JbXTtcclxuICBASW5wdXQoKSBwdWJsaWMgbGVnZW5kOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBwbHVnaW5zOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9uc1tdO1xyXG5cclxuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0Q2xpY2s6IEV2ZW50RW1pdHRlcjx7IGV2ZW50PzogTW91c2VFdmVudCwgYWN0aXZlPzoge31bXSB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0SG92ZXI6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50LCBhY3RpdmU6IHt9W10gfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHB1YmxpYyBjdHg6IHN0cmluZztcclxuICBwdWJsaWMgY2hhcnQ6IENoYXJ0O1xyXG5cclxuICBwcml2YXRlIG9sZDogT2xkU3RhdGUgPSB7XHJcbiAgICBkYXRhRXhpc3RzOiBmYWxzZSxcclxuICAgIGRhdGFMZW5ndGg6IDAsXHJcbiAgICBkYXRhc2V0c0V4aXN0czogZmFsc2UsXHJcbiAgICBkYXRhc2V0c0xlbmd0aDogMCxcclxuICAgIGRhdGFzZXRzRGF0YU9iamVjdHM6IFtdLFxyXG4gICAgZGF0YXNldHNEYXRhTGVuZ3RoczogW10sXHJcbiAgICBjb2xvcnNFeGlzdHM6IGZhbHNlLFxyXG4gICAgY29sb3JzOiBbXSxcclxuICAgIGxhYmVsc0V4aXN0OiBmYWxzZSxcclxuICAgIGxhYmVsczogW10sXHJcbiAgICBsZWdlbmRFeGlzdHM6IGZhbHNlLFxyXG4gICAgbGVnZW5kOiB7fSxcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVyIGEgcGx1Z2luLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJQbHVnaW4ocGx1Z2luOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgcGx1Z2luU2VydmljZS5yZWdpc3RlcihwbHVnaW4pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB1bnJlZ2lzdGVyUGx1Z2luKHBsdWdpbjogUGx1Z2luU2VydmljZUdsb2JhbFJlZ2lzdHJhdGlvbkFuZE9wdGlvbnMpOiB2b2lkIHtcclxuICAgIHBsdWdpblNlcnZpY2UudW5yZWdpc3RlcihwbHVnaW4pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSB0aGVtZVNlcnZpY2U6IFRoZW1lU2VydmljZSxcclxuICApIHsgfVxyXG5cclxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMudGhlbWVTZXJ2aWNlLmNvbG9yc2NoZW1lc09wdGlvbnMuc3Vic2NyaWJlKHIgPT4gdGhpcy50aGVtZUNoYW5nZWQocikpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdGhlbWVDaGFuZ2VkKG9wdGlvbnM6IHt9KTogdm9pZCB7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuICB9XHJcblxyXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5jaGFydCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgdXBkYXRlUmVxdWlyZWQgPSBVcGRhdGVUeXBlLkRlZmF1bHQ7XHJcbiAgICBjb25zdCB3YW50VXBkYXRlID0gKHg6IFVwZGF0ZVR5cGUpID0+IHtcclxuICAgICAgdXBkYXRlUmVxdWlyZWQgPSB4ID4gdXBkYXRlUmVxdWlyZWQgPyB4IDogdXBkYXRlUmVxdWlyZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICghIXRoaXMuZGF0YSAhPT0gdGhpcy5vbGQuZGF0YUV4aXN0cykge1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFUb0RhdGFzZXRzKHRoaXMuZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLm9sZC5kYXRhRXhpc3RzID0gISF0aGlzLmRhdGE7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFMZW5ndGgpIHtcclxuICAgICAgdGhpcy5vbGQuZGF0YUxlbmd0aCA9IHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEubGVuZ3RoIHx8IDA7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISF0aGlzLmRhdGFzZXRzICE9PSB0aGlzLm9sZC5kYXRhc2V0c0V4aXN0cykge1xyXG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0V4aXN0cyA9ICEhdGhpcy5kYXRhc2V0cztcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMubGVuZ3RoICE9PSB0aGlzLm9sZC5kYXRhc2V0c0xlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0xlbmd0aCA9IHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5sZW5ndGggfHwgMDtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMuZmlsdGVyKCh4LCBpKSA9PiB4LmRhdGEgIT09IHRoaXMub2xkLmRhdGFzZXRzRGF0YU9iamVjdHNbaV0pLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0RhdGFPYmplY3RzID0gdGhpcy5kYXRhc2V0cy5tYXAoeCA9PiB4LmRhdGEpO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5maWx0ZXIoKHgsIGkpID0+IHguZGF0YS5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFzZXRzRGF0YUxlbmd0aHNbaV0pLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0RhdGFMZW5ndGhzID0gdGhpcy5kYXRhc2V0cy5tYXAoeCA9PiB4LmRhdGEubGVuZ3RoKTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghIXRoaXMuY29sb3JzICE9PSB0aGlzLm9sZC5jb2xvcnNFeGlzdHMpIHtcclxuICAgICAgdGhpcy5vbGQuY29sb3JzRXhpc3RzID0gISF0aGlzLmNvbG9ycztcclxuXHJcbiAgICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGlzIHNtZWxscyBvZiBpbmVmZmljaWVuY3ksIG1pZ2h0IG5lZWQgdG8gcmV2aXNpdCB0aGlzXHJcbiAgICBpZiAodGhpcy5jb2xvcnMgJiYgdGhpcy5jb2xvcnMuZmlsdGVyKCh4LCBpKSA9PiAhdGhpcy5jb2xvcnNFcXVhbCh4LCB0aGlzLm9sZC5jb2xvcnNbaV0pKS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5vbGQuY29sb3JzID0gdGhpcy5jb2xvcnMubWFwKHggPT4gdGhpcy5jb3B5Q29sb3IoeCkpO1xyXG5cclxuICAgICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghIXRoaXMubGFiZWxzICE9PSB0aGlzLm9sZC5sYWJlbHNFeGlzdCkge1xyXG4gICAgICB0aGlzLm9sZC5sYWJlbHNFeGlzdCA9ICEhdGhpcy5sYWJlbHM7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5sYWJlbHMgJiYgdGhpcy5sYWJlbHMuZmlsdGVyKCh4LCBpKSA9PiAhdGhpcy5sYWJlbHNFcXVhbCh4LCB0aGlzLm9sZC5sYWJlbHNbaV0pKS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5vbGQubGFiZWxzID0gdGhpcy5sYWJlbHMubWFwKHggPT4gdGhpcy5jb3B5TGFiZWwoeCkpO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEhdGhpcy5vcHRpb25zLmxlZ2VuZCAhPT0gdGhpcy5vbGQubGVnZW5kRXhpc3RzKSB7XHJcbiAgICAgIHRoaXMub2xkLmxlZ2VuZEV4aXN0cyA9ICEhdGhpcy5vcHRpb25zLmxlZ2VuZDtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5SZWZyZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmxlZ2VuZCAmJiB0aGlzLm9wdGlvbnMubGVnZW5kLnBvc2l0aW9uICE9PSB0aGlzLm9sZC5sZWdlbmQucG9zaXRpb24pIHtcclxuICAgICAgdGhpcy5vbGQubGVnZW5kLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLmxlZ2VuZC5wb3NpdGlvbjtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5SZWZyZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHVwZGF0ZVJlcXVpcmVkIGFzIFVwZGF0ZVR5cGUpIHtcclxuICAgICAgY2FzZSBVcGRhdGVUeXBlLkRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVXBkYXRlVHlwZS5VcGRhdGU6XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBVcGRhdGVUeXBlLlJlZnJlc2g6XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb3B5TGFiZWwoYTogTGFiZWwpOiBMYWJlbCB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xyXG4gICAgICByZXR1cm4gWy4uLmFdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGE7XHJcbiAgfVxyXG5cclxuICBsYWJlbHNFcXVhbChhOiBMYWJlbCwgYjogTGFiZWwpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpID09PSBBcnJheS5pc0FycmF5KGIpXHJcbiAgICAgICYmIChBcnJheS5pc0FycmF5KGEpIHx8IGEgPT09IGIpXHJcbiAgICAgICYmICghQXJyYXkuaXNBcnJheShhKSB8fCBhLmxlbmd0aCA9PT0gYi5sZW5ndGgpXHJcbiAgICAgICYmICghQXJyYXkuaXNBcnJheShhKSB8fCBhLmZpbHRlcigoeCwgaSkgPT4geCAhPT0gYltpXSkubGVuZ3RoID09PSAwKVxyXG4gICAgICA7XHJcbiAgfVxyXG5cclxuICBjb3B5Q29sb3IoYTogQ29sb3IpOiBDb2xvciB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICBib3JkZXJXaWR0aDogYS5ib3JkZXJXaWR0aCxcclxuICAgICAgYm9yZGVyQ29sb3I6IGEuYm9yZGVyQ29sb3IsXHJcbiAgICAgIGJvcmRlckNhcFN0eWxlOiBhLmJvcmRlckNhcFN0eWxlLFxyXG4gICAgICBib3JkZXJEYXNoOiBhLmJvcmRlckRhc2gsXHJcbiAgICAgIGJvcmRlckRhc2hPZmZzZXQ6IGEuYm9yZGVyRGFzaE9mZnNldCxcclxuICAgICAgYm9yZGVySm9pblN0eWxlOiBhLmJvcmRlckpvaW5TdHlsZSxcclxuICAgICAgcG9pbnRCb3JkZXJDb2xvcjogYS5wb2ludEJvcmRlckNvbG9yLFxyXG4gICAgICBwb2ludEJhY2tncm91bmRDb2xvcjogYS5wb2ludEJhY2tncm91bmRDb2xvcixcclxuICAgICAgcG9pbnRCb3JkZXJXaWR0aDogYS5wb2ludEJvcmRlcldpZHRoLFxyXG4gICAgICBwb2ludFJhZGl1czogYS5wb2ludFJhZGl1cyxcclxuICAgICAgcG9pbnRIb3ZlclJhZGl1czogYS5wb2ludEhvdmVyUmFkaXVzLFxyXG4gICAgICBwb2ludEhpdFJhZGl1czogYS5wb2ludEhpdFJhZGl1cyxcclxuICAgICAgcG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcjogYS5wb2ludEhvdmVyQmFja2dyb3VuZENvbG9yLFxyXG4gICAgICBwb2ludEhvdmVyQm9yZGVyQ29sb3I6IGEucG9pbnRIb3ZlckJvcmRlckNvbG9yLFxyXG4gICAgICBwb2ludEhvdmVyQm9yZGVyV2lkdGg6IGEucG9pbnRIb3ZlckJvcmRlcldpZHRoLFxyXG4gICAgICBwb2ludFN0eWxlOiBhLnBvaW50U3R5bGUsXHJcbiAgICAgIGhvdmVyQmFja2dyb3VuZENvbG9yOiBhLmhvdmVyQmFja2dyb3VuZENvbG9yLFxyXG4gICAgICBob3ZlckJvcmRlckNvbG9yOiBhLmhvdmVyQm9yZGVyQ29sb3IsXHJcbiAgICAgIGhvdmVyQm9yZGVyV2lkdGg6IGEuaG92ZXJCb3JkZXJXaWR0aCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb2xvcnNFcXVhbChhOiBDb2xvciwgYjogQ29sb3IpOiBib29sZWFuIHtcclxuICAgIGlmICghYSAhPT0gIWIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICFhIHx8XHJcbiAgICAgIChhLmJhY2tncm91bmRDb2xvciA9PT0gYi5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICYmIChhLmJvcmRlcldpZHRoID09PSBiLmJvcmRlcldpZHRoKVxyXG4gICAgICAmJiAoYS5ib3JkZXJDb2xvciA9PT0gYi5ib3JkZXJDb2xvcilcclxuICAgICAgJiYgKGEuYm9yZGVyQ2FwU3R5bGUgPT09IGIuYm9yZGVyQ2FwU3R5bGUpXHJcbiAgICAgICYmIChhLmJvcmRlckRhc2ggPT09IGIuYm9yZGVyRGFzaClcclxuICAgICAgJiYgKGEuYm9yZGVyRGFzaE9mZnNldCA9PT0gYi5ib3JkZXJEYXNoT2Zmc2V0KVxyXG4gICAgICAmJiAoYS5ib3JkZXJKb2luU3R5bGUgPT09IGIuYm9yZGVySm9pblN0eWxlKVxyXG4gICAgICAmJiAoYS5wb2ludEJvcmRlckNvbG9yID09PSBiLnBvaW50Qm9yZGVyQ29sb3IpXHJcbiAgICAgICYmIChhLnBvaW50QmFja2dyb3VuZENvbG9yID09PSBiLnBvaW50QmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAmJiAoYS5wb2ludEJvcmRlcldpZHRoID09PSBiLnBvaW50Qm9yZGVyV2lkdGgpXHJcbiAgICAgICYmIChhLnBvaW50UmFkaXVzID09PSBiLnBvaW50UmFkaXVzKVxyXG4gICAgICAmJiAoYS5wb2ludEhvdmVyUmFkaXVzID09PSBiLnBvaW50SG92ZXJSYWRpdXMpXHJcbiAgICAgICYmIChhLnBvaW50SGl0UmFkaXVzID09PSBiLnBvaW50SGl0UmFkaXVzKVxyXG4gICAgICAmJiAoYS5wb2ludEhvdmVyQmFja2dyb3VuZENvbG9yID09PSBiLnBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICYmIChhLnBvaW50SG92ZXJCb3JkZXJDb2xvciA9PT0gYi5wb2ludEhvdmVyQm9yZGVyQ29sb3IpXHJcbiAgICAgICYmIChhLnBvaW50SG92ZXJCb3JkZXJXaWR0aCA9PT0gYi5wb2ludEhvdmVyQm9yZGVyV2lkdGgpXHJcbiAgICAgICYmIChhLnBvaW50U3R5bGUgPT09IGIucG9pbnRTdHlsZSlcclxuICAgICAgJiYgKGEuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPT09IGIuaG92ZXJCYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICYmIChhLmhvdmVyQm9yZGVyQ29sb3IgPT09IGIuaG92ZXJCb3JkZXJDb2xvcilcclxuICAgICAgJiYgKGEuaG92ZXJCb3JkZXJXaWR0aCA9PT0gYi5ob3ZlckJvcmRlcldpZHRoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvbG9ycygpOiB2b2lkIHtcclxuICAgIHRoaXMuZGF0YXNldHMuZm9yRWFjaCgoZWxtLCBpbmRleCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jb2xvcnMgJiYgdGhpcy5jb2xvcnNbaW5kZXhdKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbG0sIHRoaXMuY29sb3JzW2luZGV4XSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbG0sIGdldENvbG9ycyh0aGlzLmNoYXJ0VHlwZSwgaW5kZXgsIGVsbS5kYXRhLmxlbmd0aCksIHsgLi4uZWxtIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBsZXQgdXBkYXRlUmVxdWlyZWQgPSBVcGRhdGVUeXBlLkRlZmF1bHQ7XHJcbiAgICBjb25zdCB3YW50VXBkYXRlID0gKHg6IFVwZGF0ZVR5cGUpID0+IHtcclxuICAgICAgdXBkYXRlUmVxdWlyZWQgPSB4ID4gdXBkYXRlUmVxdWlyZWQgPyB4IDogdXBkYXRlUmVxdWlyZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFuZ2VzIGFyZSBpbiB0aGUgZGF0YSBvciBkYXRhc2V0cyBvciBsYWJlbHMgb3IgbGVnZW5kXHJcblxyXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSAmJiBjaGFuZ2VzLmRhdGEuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YVRvRGF0YXNldHMoY2hhbmdlcy5kYXRhLmN1cnJlbnRWYWx1ZSk7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGF0YXNldHMnKSAmJiBjaGFuZ2VzLmRhdGFzZXRzLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFzZXRzVG9EYXRhKGNoYW5nZXMuZGF0YXNldHMuY3VycmVudFZhbHVlKTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdsYWJlbHMnKSkge1xyXG4gICAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICAgIHRoaXMuY2hhcnQuZGF0YS5sYWJlbHMgPSBjaGFuZ2VzLmxhYmVscy5jdXJyZW50VmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdsZWdlbmQnKSkge1xyXG4gICAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLm9wdGlvbnMubGVnZW5kLmRpc3BsYXkgPSBjaGFuZ2VzLmxlZ2VuZC5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgdGhpcy5jaGFydC5nZW5lcmF0ZUxlZ2VuZCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnb3B0aW9ucycpKSB7XHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5SZWZyZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHVwZGF0ZVJlcXVpcmVkIGFzIFVwZGF0ZVR5cGUpIHtcclxuICAgICAgY2FzZSBVcGRhdGVUeXBlLlVwZGF0ZTpcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuUmVmcmVzaDpcclxuICAgICAgY2FzZSBVcGRhdGVUeXBlLkRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jaGFydCA9IHZvaWQgMDtcclxuICAgIH1cclxuICAgIHRoaXMuc3Vicy5mb3JFYWNoKHggPT4geC51bnN1YnNjcmliZSgpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1cGRhdGUoZHVyYXRpb24/OiBhbnkpOiB7fSB7XHJcbiAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGFydC51cGRhdGUoZHVyYXRpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGhpZGVEYXRhc2V0KGluZGV4OiBudW1iZXIsIGhpZGRlbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5jaGFydC5nZXREYXRhc2V0TWV0YShpbmRleCkuaGlkZGVuID0gaGlkZGVuO1xyXG4gICAgdGhpcy5jaGFydC51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0RhdGFzZXRIaWRkZW4oaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2V0RGF0YXNldE1ldGEoaW5kZXgpLmhpZGRlbjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b0Jhc2U2NEltYWdlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGFydC50b0Jhc2U2NEltYWdlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0Q2hhcnRDb25maWd1cmF0aW9uKCk6IENoYXJ0Q29uZmlndXJhdGlvbiB7XHJcbiAgICBjb25zdCBkYXRhc2V0cyA9IHRoaXMuZ2V0RGF0YXNldHMoKTtcclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcclxuICAgIGlmICh0aGlzLmxlZ2VuZCA9PT0gZmFsc2UpIHtcclxuICAgICAgb3B0aW9ucy5sZWdlbmQgPSB7IGRpc3BsYXk6IGZhbHNlIH07XHJcbiAgICB9XHJcbiAgICAvLyBob29rIGZvciBvbkhvdmVyIGFuZCBvbkNsaWNrIGV2ZW50c1xyXG4gICAgb3B0aW9ucy5ob3ZlciA9IG9wdGlvbnMuaG92ZXIgfHwge307XHJcbiAgICBpZiAoIW9wdGlvbnMuaG92ZXIub25Ib3Zlcikge1xyXG4gICAgICBvcHRpb25zLmhvdmVyLm9uSG92ZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGl2ZToge31bXSkgPT4ge1xyXG4gICAgICAgIGlmIChhY3RpdmUgJiYgIWFjdGl2ZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaGFydEhvdmVyLmVtaXQoeyBldmVudCwgYWN0aXZlIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy5vbkNsaWNrKSB7XHJcbiAgICAgIG9wdGlvbnMub25DbGljayA9IChldmVudD86IE1vdXNlRXZlbnQsIGFjdGl2ZT86IHt9W10pID0+IHtcclxuICAgICAgICB0aGlzLmNoYXJ0Q2xpY2suZW1pdCh7IGV2ZW50LCBhY3RpdmUgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHRoaXMuc21hcnRNZXJnZShvcHRpb25zLCB0aGlzLnRoZW1lU2VydmljZS5nZXRDb2xvcnNjaGVtZXNPcHRpb25zKCkpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgbGFiZWxzOiB0aGlzLmxhYmVscyB8fCBbXSxcclxuICAgICAgICBkYXRhc2V0c1xyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiB0aGlzLnBsdWdpbnMsXHJcbiAgICAgIG9wdGlvbnM6IG1lcmdlZE9wdGlvbnMsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldENoYXJ0QnVpbGRlcihjdHg6IHN0cmluZy8qLCBkYXRhOmFueVtdLCBvcHRpb25zOmFueSovKTogQ2hhcnQge1xyXG4gICAgY29uc3QgY2hhcnRDb25maWcgPSB0aGlzLmdldENoYXJ0Q29uZmlndXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBDaGFydChjdHgsIGNoYXJ0Q29uZmlnKTtcclxuICB9XHJcblxyXG4gIHNtYXJ0TWVyZ2Uob3B0aW9uczogYW55LCBvdmVycmlkZXM6IGFueSwgbGV2ZWw6IG51bWJlciA9IDApOiBhbnkge1xyXG4gICAgaWYgKGxldmVsID09PSAwKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBjbG9uZURlZXAob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBrZXlzVG9VcGRhdGUgPSBPYmplY3Qua2V5cyhvdmVycmlkZXMpO1xyXG4gICAga2V5c1RvVXBkYXRlLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3ZlcnJpZGVzW2tleV0pKSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXlFbGVtZW50cyA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgICBpZiAoYXJyYXlFbGVtZW50cykge1xyXG4gICAgICAgICAgYXJyYXlFbGVtZW50cy5mb3JFYWNoKHIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNtYXJ0TWVyZ2Uociwgb3ZlcnJpZGVzW2tleV1bMF0sIGxldmVsICsgMSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIChvdmVycmlkZXNba2V5XSkgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgaWYgKCEoa2V5IGluIG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICBvcHRpb25zW2tleV0gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zbWFydE1lcmdlKG9wdGlvbnNba2V5XSwgb3ZlcnJpZGVzW2tleV0sIGxldmVsICsgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9uc1trZXldID0gb3ZlcnJpZGVzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKGxldmVsID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc011bHRpTGluZUxhYmVsKGxhYmVsOiBMYWJlbCk6IGxhYmVsIGlzIE11bHRpTGluZUxhYmVsIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGxhYmVsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgam9pbkxhYmVsKGxhYmVsOiBMYWJlbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWxhYmVsKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuaXNNdWx0aUxpbmVMYWJlbChsYWJlbCkpIHtcclxuICAgICAgcmV0dXJuIGxhYmVsLmpvaW4oJyAnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJvcGFnYXRlRGF0YXNldHNUb0RhdGEoZGF0YXNldHM6IENoYXJ0RGF0YVNldHNbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhc2V0cy5tYXAociA9PiByLmRhdGEpO1xyXG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcclxuICAgICAgdGhpcy5jaGFydC5kYXRhLmRhdGFzZXRzID0gZGF0YXNldHM7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyhuZXdEYXRhVmFsdWVzOiBTaW5nbGVPck11bHRpRGF0YVNldCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNNdWx0aURhdGFTZXQobmV3RGF0YVZhbHVlcykpIHtcclxuICAgICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgbmV3RGF0YVZhbHVlcy5sZW5ndGggPT09IHRoaXMuZGF0YXNldHMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhc2V0cy5mb3JFYWNoKChkYXRhc2V0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgIGRhdGFzZXQuZGF0YSA9IG5ld0RhdGFWYWx1ZXNbaV07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5kYXRhc2V0cyA9IG5ld0RhdGFWYWx1ZXMubWFwKChkYXRhOiBudW1iZXJbXSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHsgZGF0YSwgbGFiZWw6IHRoaXMuam9pbkxhYmVsKHRoaXMubGFiZWxzW2luZGV4XSkgfHwgYExhYmVsICR7aW5kZXh9YCB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0LmRhdGEuZGF0YXNldHMgPSB0aGlzLmRhdGFzZXRzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCF0aGlzLmRhdGFzZXRzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhc2V0cyA9IFt7IGRhdGE6IG5ld0RhdGFWYWx1ZXMgfV07XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhcnQpIHtcclxuICAgICAgICAgIHRoaXMuY2hhcnQuZGF0YS5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghdGhpcy5kYXRhc2V0c1swXSkge1xyXG4gICAgICAgICAgdGhpcy5kYXRhc2V0c1swXSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kYXRhc2V0c1swXS5kYXRhID0gbmV3RGF0YVZhbHVlcztcclxuICAgICAgICB0aGlzLmRhdGFzZXRzLnNwbGljZSgxKTsgLy8gUmVtb3ZlIGFsbCBlbGVtZW50cyBidXQgdGhlIGZpcnN0XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzTXVsdGlEYXRhU2V0KGRhdGE6IFNpbmdsZU9yTXVsdGlEYXRhU2V0KTogZGF0YSBpcyBNdWx0aURhdGFTZXQge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGF0YVswXSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERhdGFzZXRzKCk6IENoYXJ0LkNoYXJ0RGF0YVNldHNbXSB7XHJcbiAgICBpZiAoIXRoaXMuZGF0YXNldHMgJiYgIXRoaXMuZGF0YSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5nLWNoYXJ0cyBjb25maWd1cmF0aW9uIGVycm9yLCBkYXRhIG9yIGRhdGFzZXRzIGZpZWxkIGFyZSByZXF1aXJlZCB0byByZW5kZXIgY2hhcnQgJHsgdGhpcy5jaGFydFR5cGUgfWApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGBkYXRhc2V0c2AgaXMgZGVmaW5lZCwgdXNlIGl0IG92ZXIgdGhlIGBkYXRhYCBwcm9wZXJ0eS5cclxuICAgIGlmICh0aGlzLmRhdGFzZXRzKSB7XHJcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YXNldHNUb0RhdGEodGhpcy5kYXRhc2V0cyk7XHJcbiAgICAgIHJldHVybiB0aGlzLmRhdGFzZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmRhdGEpIHtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyh0aGlzLmRhdGEpO1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXRhc2V0cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgIC8vIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnJlc3BvbnNpdmUpIHtcclxuICAgIC8vICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlZnJlc2goKSwgNTApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHRvZG86IHJlbW92ZSB0aGlzIGxpbmUsIGl0IGlzIHByb2R1Y2luZyBmbGlja2VyaW5nXHJcbiAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jaGFydCA9IHZvaWQgMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmN0eCkge1xyXG4gICAgICB0aGlzLmNoYXJ0ID0gdGhpcy5nZXRDaGFydEJ1aWxkZXIodGhpcy5jdHgvKiwgZGF0YSwgdGhpcy5vcHRpb25zKi8pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=