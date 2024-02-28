/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Vec2 } from "@/XIV/Models/Vec2";
export class Drawing {
    drawText(text, x, y, options = {}) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const pos = this.translate(x, y, options);
        if (this.isFrustrumCulled(pos, 0, options)) {
            return;
        }
        this.context.font = `${options.size || 12}px ${options.font || 'Tahoma'}`;
        this.context.textAlign = options.align || 'center';
        this.context.textBaseline = options.baseline || 'middle';
        if (options.shadow) {
            this.context.shadowColor = 'rgba(0, 0, 0, 1)';
            this.context.shadowBlur = 4;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
        }
        if (options.outline) {
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 2;
            this.context.strokeText(text, pos.x, pos.y);
        }
        this.context.fillStyle = options.color || 'white';
        this.context.fillText(text, pos.x, pos.y);
        this.context.shadowColor = null;
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.strokeStyle = null;
        this.context.lineWidth = 1;
    }
    measureText(text, options = {}) {
        this.context.font = `${options.size || 12}px ${options.font || 'Tahoma'}`;
        this.context.textAlign = options.align || 'center';
        this.context.textBaseline = options.baseline || 'middle';
        return this.context.measureText(text);
    }
    drawViewCone(x, y, angle, options) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const pos = this.translate(x, y, options);
        const length = options.length;
        const width = options.width; // this.applyScaleOptions(options.width, options);
        if (this.isFrustrumCulled(pos, length, options)) {
            return;
        }
        const ctx = this.context;
        const a = (angle + (Math.PI)) + (width / 2);
        const r = options.length * this.camera.zoom;
        x = pos.x;
        y = pos.y;
        const tX = x + options.length * Math.cos(a);
        const tY = y + options.length * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tX, tY);
        ctx.arc(x, y, r, a, a + (options.width));
        ctx.lineTo(x, y);
        ctx.closePath();
        var g = this.context.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgb(${options.color.join(',')}, ${options.opacity || 0.5})`);
        g.addColorStop(1, `rgba(${options.color.join(',')}, 0)`);
        var ga = this.context.globalAlpha;
        this.context.globalAlpha = options.opacity || 0.5;
        ctx.fillStyle = g;
        this.context.globalAlpha = ga;
        ctx.strokeStyle = g;
        this.context.fill();
        this.context.stroke();
        this.resetShapeOptions();
    }
    drawArc(x, y, options) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const pos = this.translate(x, y, options);
        const rad = this.applyScaleOptions(options.radius, options);
        if (this.isFrustrumCulled(pos, rad, options)) {
            return;
        }
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, rad, options.startAngle || 0, options.endAngle || Math.PI * 2, options.anticlockwise || false);
        this.context.closePath();
        this.applyShapeOptions(options);
        if (options.fill)
            this.context.fill();
        if (options.stroke)
            this.context.stroke();
        this.resetShapeOptions();
    }
    drawSquare(x, y, size, options) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const pos = this.translate(x, y, options);
        const rad = this.applyScaleOptions(size, options);
        if (this.isFrustrumCulled(pos, rad, options)) {
            return;
        }
        this.context.beginPath();
        this.context.rect(pos.x - rad / 2, pos.y - rad / 2, rad, rad);
        this.context.closePath();
        this.applyShapeOptions(options);
        if (options.fill)
            this.context.fill();
        if (options.stroke)
            this.context.stroke();
        this.resetShapeOptions();
    }
    drawLine(x1, y1, x2, y2, options) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const pos1 = this.translate(x1, y1, options);
        const pos2 = this.translate(x2, y2, options);
        if (this.isFrustrumCulled(pos1, 0, options) && this.isFrustrumCulled(pos2, 0, options)) {
            return;
        }
        this.context.beginPath();
        this.context.moveTo(pos1.x, pos1.y);
        this.context.lineTo(pos2.x, pos2.y);
        this.applyShapeOptions(options);
        this.context.stroke();
        this.resetShapeOptions();
    }
    drawIcon(iconId, position, options) {
        if (!this.isWithinZoomFactor(options)) {
            return;
        }
        const img = this.icons.getCached(iconId);
        if (!img) {
            return;
        }
        const pos = this.translate(position.x, position.y, options);
        const size = new Vec2(options.size || img.width, options.size || img.height).mut();
        if (options.autoScale) {
            size.multiplyScalar(this.camera.zoom);
            if (options.minScale) {
                size.x = Math.max(size.x, options.minScale);
                size.y = Math.max(size.y, options.minScale);
            }
            if (options.maxScale) {
                size.x = Math.min(size.x, options.maxScale);
                size.y = Math.min(size.y, options.maxScale);
            }
        }
        if (this.isFrustrumCulled(pos, size.x, options)) {
            return;
        }
        this.applyShapeOptions(options);
        if (!options.rotation) {
            this.context.drawImage(img, pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
        }
        else {
            this.context.save();
            this.context.translate(pos.x, pos.y);
            this.context.rotate(options.rotation);
            this.context.drawImage(img, -size.x / 2, -size.y / 2, size.x, size.y);
            this.context.restore();
        }
        this.resetShapeOptions();
    }
    isFrustrumCulled(pos, size, options) {
        if (!options.frustumCulled) {
            return false;
        }
        const vs = this.viewport.size;
        if (pos.x + size < 0 || pos.x - size > vs.width) {
            return true;
        }
        if (pos.y + size < 0 || pos.y - size > vs.height) {
            return true;
        }
        return false;
    }
    isWithinZoomFactor(options) {
        if (options.minZoom && this.camera.zoom < options.minZoom) {
            return false;
        }
        if (options.maxZoom && this.camera.zoom > options.maxZoom) {
            return false;
        }
        return true;
    }
    applyScaleOptions(input, options) {
        if (!options.autoScale) {
            return input;
        }
        let result = input * this.camera.zoom;
        if (options.minScale) {
            result = Math.max(result, options.minScale);
        }
        if (options.maxScale) {
            result = Math.min(result, options.maxScale);
        }
        return result;
    }
    applyShapeOptions(options) {
        if (options.alpha) {
            this.context.globalAlpha = options.alpha;
        }
        if (options.stroke) {
            this.context.setLineDash(options.strokeDash || []);
            this.context.strokeStyle = options.stroke;
            this.context.lineWidth = options.strokeWidth || 1;
            this.context.lineDashOffset = options.dashOffset || 0;
        }
        if (options.fill) {
            this.context.fillStyle = options.fill;
        }
        if (options.filter) {
            this.context.filter = options.filter;
        }
    }
    resetShapeOptions() {
        this.context.lineWidth = 1;
        this.context.lineDashOffset = 0;
        this.context.globalAlpha = 1.0;
        this.context.filter = 'none';
        this.context.setLineDash([]);
    }
    translate(x, y = null, options = null) {
        if (typeof x === 'object' && x instanceof Vec2) {
            return this.translate(x.x, x.y, options ?? {});
        }
        if (options.noTranslate) {
            return new Vec2(x, y);
        }
        return new Vec2((x - this.scissor.rect.x) * this.camera.zoom, (y - this.scissor.rect.y) * this.camera.zoom);
    }
    findIntersection(p1, p2, transformToUnscaled = false) {
        if (transformToUnscaled) {
            p1 = this.translate(p1);
            p2 = this.translate(p2);
        }
        let intersection = null;
        const viewport = { x1: 0, y1: 0, x2: this.viewport.size.width, y2: this.viewport.size.height };
        // Calculate slope (m) and y-intercept (b) for the line equation (y = mx + b)
        const m = (p2.y - p1.y) / (p2.x - p1.x);
        const b = p1.y - m * p1.x;
        // Calculate intersection points with each viewport boundary
        const intersectionXTop = (viewport.y1 - b) / m;
        const intersectionXBottom = (viewport.y2 - b) / m;
        const intersectionYLeft = m * viewport.x1 + b;
        const intersectionYRight = m * viewport.x2 + b;
        // Check if the calculated intersection points lie within the viewport boundaries
        if (!isNaN(intersectionXTop) && intersectionXTop >= viewport.x1 && intersectionXTop <= viewport.x2 && viewport.y1 >= Math.min(p1.y, p2.y) && viewport.y1 <= Math.max(p1.y, p2.y)) {
            intersection = new Vec2(intersectionXTop, viewport.y1);
        }
        else if (!isNaN(intersectionXBottom) && intersectionXBottom >= viewport.x1 && intersectionXBottom <= viewport.x2 && viewport.y2 >= Math.min(p1.y, p2.y) && viewport.y2 <= Math.max(p1.y, p2.y)) {
            intersection = new Vec2(intersectionXBottom, viewport.y2);
        }
        else if (!isNaN(intersectionYLeft) && intersectionYLeft >= viewport.y1 && intersectionYLeft <= viewport.y2 && viewport.x1 >= Math.min(p1.x, p2.x) && viewport.x1 <= Math.max(p1.x, p2.x)) {
            intersection = new Vec2(viewport.x1, intersectionYLeft);
        }
        else if (!isNaN(intersectionYRight) && intersectionYRight >= viewport.y1 && intersectionYRight <= viewport.y2 && viewport.x2 >= Math.min(p1.x, p2.x) && viewport.x2 <= Math.max(p1.x, p2.x)) {
            intersection = new Vec2(viewport.x2, intersectionYRight);
        }
        return intersection;
    }
}
//# sourceMappingURL=Drawing.js.map