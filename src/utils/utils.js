/**
 * 获取图片中像素（排序完成）
 * @param {String} ctx
 */
function getCtxSortedColors(ctx) {
  let retArr = [];
  const map = {};

  const imgWidth = ctx.canvas.width;
  const imgHeight = ctx.canvas.height;

  const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0, len = imgData.data.length, cnt = 0; i < len; i += 4, cnt++) {
    let [r, g, b, a] = [
      imgData.data[i],
      imgData.data[i + 1],
      imgData.data[i + 2],
      imgData.data[i + 3],
    ];

    // calc the cartesian coordinates
    const x = cnt % imgWidth;
    const y = cnt / imgHeight;

    // calc the weight
    let weight = 1;
    const distFromCenter = Math.min(
      Math.min(x, imgWidth - x),
      Math.min(y, imgHeight - y)
    );
    weight += (imgWidth / 2 - distFromCenter) * 1;

    // statistical data
    if (map[`${r}${g}${b}`] === undefined) {
      map[`${r}${g}${b}`] = retArr.length;
      retArr.push({
        r,
        g,
        b,
        a,
        weight,
      });
    } else {
      retArr[map[`${r}${g}${b}`]].weight += weight;
    }
  }

  retArr = retArr.sort((a, b) => {
    if (a.weight > b.weight) {
      return -1;
    } else if (a.weight < b.weight) {
      return 1;
    }
    return 0;
  });

  console.log(retArr.slice(0, 5));
  return retArr;
}

/**
 * trans rgb to hsl
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
function rgb2hsl(r, g, b) {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h = 0;
  let l = (max + min) / 2.0;
  let s = 0;

  if (max === min) {
    h = 0;
  } else if (max === r && g >= b) {
    h = (60 * (g - b)) / (max - min);
  } else if (max === r && g < b) {
    h = (60 * (g - b)) / (max - min) + 360;
  } else if (max === g) {
    h = (60 * (b - r)) / (max - min) + 120;
  } else if (max === b) {
    h = (60 * (r - g)) / (max - min) + 240;
  }

  if (l === 0 || max === min) {
    s = 0;
  } else if (0 < l && l <= 0.5) {
    s = (max - min) / (2 * l);
  } else if (l > 0.5) {
    s = (max - min) / (2 - 2 * l);
  }

  return [h, s, l];
}

/**
 * 计算两个颜色之间的距离
 * @param {Object} a rgbObject1
 * @param {Object} b rgbObject2
 * @return {Number} 在[0, 1]的4位小数，代表距离大小
 */
function getColorDist(a, b) {
  const dist = Math.sqrt(
    Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
  );
  return (dist / 441.67295593).toFixed(4);
}

/**
 * 获取一张图片中的主颜色、副颜色
 * @param {String} imgSrc
 * @param {Number} threshold RGB空间色差阈值,取值范围(0, 255√3)
 * @param {Callback} callback 计算完成后执行的回调函数
 */
export function getColorSet(
  imgSrc,
  threshold = 0.1,
  callback = function () {}
) {
  let chairColor = { r: 0, g: 0, b: 0 };
  let viceColor = { r: 0, g: 0, b: 0 };

  const canvas = document.createElement("canvas");
  const img = new Image();

  img.src = imgSrc;
  img.onload = function () {
    let imgObj = this;

    canvas.width = imgObj.width;
    canvas.height = imgObj.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgObj, 0, 0);

    let sortedArr = getCtxSortedColors(ctx);
    const arrLen = sortedArr.length;
    chairColor = sortedArr[0];

    for (let i = 1, dist; i < arrLen; i++) {
      dist = getColorDist(chairColor, sortedArr[i]);
      if (dist > threshold) {
        viceColor = sortedArr[i];
        break;
      }
    }

    typeof callback === "function" &&
      callback.call(undefined, {
        chairColor,
        viceColor,
      });
  };
}

export function rgb2str({ r, g, b }) {
  return `rgb(${r},${g},${b})`;
}
