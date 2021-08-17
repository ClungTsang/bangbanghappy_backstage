export const formatUrl = arrFile => {
  const arrUrl = [];
  arrFile.forEach(item => {
    arrUrl.push(item.url.substr(item.url.lastIndexOf("myqcloud.com/") + 13));
  });
  return arrUrl;
};
export const restoreUrl = arrFile => {
  const arrUrl = [];
  arrFile.forEach(item => {
    arrUrl.push(
      `https://2021-bangbanghappy-1258039664.cos.ap-guangzhou.myqcloud.com/${item}`
    );
  });
  return arrUrl;
};
