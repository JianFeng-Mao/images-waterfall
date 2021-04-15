if (!window.myPlugins) {
  window.myPlugins = {};
}

window.myPlugins.createWaterfall = function (options) {
  let defaultOptions = {
    minGap: 10,
    imgSrcArr: [],
    imgWidth: 220,
    container: document.body,
  };
  let opts = Object.assign({}, defaultOptions, options);
  let imgArr = [];

  // 处理容器元素
  handleContainer();

  function handleContainer() {
    const style = getComputedStyle(opts.container);
    opts.container.style.position =
      style.position == 'static' ? 'relative' : style.position;
  }
  // 创建图片元素
  createImg();

  function createImg() {
    var frag = document.createDocumentFragment();
    for (let i = 0; i < opts.imgSrcArr.length; i++) {
      var img = new Image();
      img.style.width = opts.imgWidth + 'px';
      img.style.position = 'absolute';
      img.style.backgroundColor = '#000';
      img.style.transition = '0.5s';
      frag.appendChild(img);
      img.addEventListener('load', loadHandler(img, i));
    }
    function loadHandler(img, index) {
      img.src = opts.imgSrcArr[index];
      img.onload = debounce(setImgPos, 30);

      imgArr.push(img);
    }

    opts.container.appendChild(frag);
  }

  window.onresize = debounce(setImgPos, 300);

  // 设置图片位置
  function setImgPos() {
    const info = getHorizontalInfo();
    let arr = new Array(info.number);
    arr.fill(0);

    // 设置图片的top值
    imgArr.forEach((img) => {
      let minTop = Math.min.apply(null, arr);
      img.style.top = minTop + 'px';
      let index = arr.indexOf(minTop);
      arr[index] += img.clientHeight + info.gap;
      // 设置图片的left
      img.style.left = index * (opts.imgWidth + info.gap) + 'px';
    });
    // 设置容器高度
    opts.container.style.height = Math.max.apply(null, arr) - info.gap + 'px';
  }

  // 获取水平方向的布局信息
  function getHorizontalInfo() {
    let containerWidth = opts.container.clientWidth;
    let number = Math.floor(containerWidth / (opts.imgWidth + opts.minGap)); // 一行的图片数量
    let gap = (containerWidth - number * opts.imgWidth) / (number - 1);
    return {
      number,
      gap,
      containerWidth,
    };
  }

  // 防抖
  function debounce(cb, duration) {
    let timer = null;
    return function () {
      clearTimeout(timer);
      let args = arguments;
      timer = setTimeout(() => {
        cb.apply(this, args);
      }, duration);
    };
  }
};
