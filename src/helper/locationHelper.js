
/**
 * بررسی می‌کند که آیا یک نقطه داخل یک Polygon است یا خیر.
 * @param {Array<number>} point - مختصات نقطه [longitude, latitude].
 * @param {Array<Array<number>>} polygon - مختصات Polygon [[lon1, lat1], [lon2, lat2], ...].
 * @returns {boolean} - آیا نقطه داخل Polygon است؟
 */
export const isPointInPolygon = (point, polygon) => {
    const [x, y] = point;
    let inside = false;
  
    // پیمایش تمام اضلاع Polygon
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
  
      // بررسی تقاطع خطوط
      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
  
      if (intersect) inside = !inside;
    }
  
    return inside;
  };
  


  