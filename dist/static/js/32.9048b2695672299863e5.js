webpackJsonp([32],{"1sow":function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i={name:"MovieHot",data:function(){return{loading:!0,detailShow:!1,movies:[],span:"",screenWidth:document.body.clientWidth,timer:null,movieDetail:{boxOffice:{todayBoxDesUnit:"",todayBoxDes:"",totalBoxUnit:"",totalBoxDes:""},basic:{img:"",actors:[],director:{img:"",name:""}}},activeKey:"1",detailLoading:!0,comments:[]}},methods:{detail:function(t){var a=this;this.activeKey="1",this.detailShow=!0,this.detailLoading=!0,this.$get("movie/detail?id="+t).then(function(e){var i=JSON.parse(e.data.data);i=i.data,a.movieDetail=i,a.detailLoading=!1,a.$get("movie/comments?id="+t).then(function(t){var e=JSON.parse(t.data.data);e=e.data,a.comments=a.comments.concat(e.mini.list),a.comments=a.comments.concat(e.plus.list)})})},detailClose:function(){this.detailShow=!1,this.comments=[]},video:function(t){window.open(t)},changeTab:function(t){this.activeKey=t},getDate:function(t){return new Date(1e3*t).toLocaleString()}},mounted:function(){var t=this,a=this,e=window.innerWidth;this.span=e>1660?4:e>1250?6:e>1e3?8:e>900?10:12,window.onresize=function(){return window.screenWidth=document.body.clientWidth,void(a.screenWidth=window.screenWidth)},this.$get("movie/hot").then(function(a){var e=JSON.parse(a.data.data);t.movies=e.ms,t.loading=!1})},watch:{screenWidth:function(t){var a=this;this.timer&&clearTimeout(this.timer),this.timer=setTimeout(function(){a.screenWidth=t,a.span=t>1660?4:t>1250?6:t>1e3?8:t>900?10:12},100)}}},s={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("a-skeleton",{attrs:{active:"",loading:t.loading,paragraph:{rows:24}}},[e("div",{staticStyle:{padding:"10px"}},[e("a-row",t._l(t.movies,function(a,i){return e("a-col",{key:i,staticStyle:{padding:"1rem"},attrs:{span:t.span}},[e("a-card",{staticClass:"movie-card",staticStyle:{width:"200px"},on:{click:function(e){return t.detail(a.id)}}},[e("img",{staticStyle:{width:"198px",height:"300px"},attrs:{src:a.img,alt:"海报"}}),t._v(" "),e("div",{staticClass:"movie-desc"},[e("div",{staticClass:"movie-title",attrs:{title:a.tCn}},[e("p",[t._v(t._s(a.tCn))])]),t._v(" "),e("p",{staticStyle:{color:"#aaa","margin-bottom":"0"}},[t._v(t._s(a.movieType))]),t._v(" "),e("div",{staticClass:"movie-score",staticStyle:{"margin-bottom":".5rem"}},[a.r<1?e("a-rate",{attrs:{defaultValue:.5,allowHalf:"",disabled:""}}):a.r<2?e("a-rate",{attrs:{defaultValue:1,allowHalf:"",disabled:""}}):a.r<3?e("a-rate",{attrs:{defaultValue:1.5,allowHalf:"",disabled:""}}):a.r<4?e("a-rate",{attrs:{defaultValue:2,allowHalf:"",disabled:""}}):a.r<5?e("a-rate",{attrs:{defaultValue:2.5,allowHalf:"",disabled:""}}):a.r<6?e("a-rate",{attrs:{defaultValue:3,allowHalf:"",disabled:""}}):a.r<7?e("a-rate",{attrs:{defaultValue:3.5,allowHalf:"",disabled:""}}):a.r<8?e("a-rate",{attrs:{defaultValue:4,allowHalf:"",disabled:""}}):a.r<9?e("a-rate",{attrs:{defaultValue:4.5,allowHalf:"",disabled:""}}):a.r<10?e("a-rate",{attrs:{defaultValue:5,allowHalf:"",disabled:""}}):e("a-rate",{attrs:{defaultValue:0,allowHalf:"",disabled:""}}),t._v(" "),e("span",{staticStyle:{color:"#aaa","font-weight":"600"}},[t._v(t._s(-1===a.r?"暂无":a.r))])],1)])])],1)}),1),t._v(" "),e("a-modal",{staticClass:"movie-detail",attrs:{width:700,keyboard:!1,centered:!0,maskClosable:!1,mask:!1,footer:null},on:{cancel:t.detailClose},model:{value:t.detailShow,callback:function(a){t.detailShow=a},expression:"detailShow"}},[e("a-tabs",{ref:"movieTabs",attrs:{activeKey:t.activeKey},on:{change:t.changeTab}},[e("a-tab-pane",{key:"1",attrs:{tab:"电影详情"}},[e("a-skeleton",{attrs:{active:"",loading:t.detailLoading,paragraph:{rows:14}}},[e("span",[e("a-row",{attrs:{gutter:2}},[e("a-col",{staticClass:"poster",attrs:{span:12}},[e("img",{staticClass:"poster-img",attrs:{alt:"电影海报",src:t.movieDetail.basic.img}})]),t._v(" "),e("a-col",{attrs:{span:12}},[e("p",[t._v("片名："+t._s(t.movieDetail.basic.name))]),t._v(" "),e("p",[t._v("片长："+t._s(t.movieDetail.basic.mins))]),t._v(" "),e("p",[t._v("是否3D："+t._s(t.movieDetail.basic.is3D?"是":"否"))]),t._v(" "),e("p",[t._v("是否IMAX："+t._s(t.movieDetail.basic.isIMAX?"是":"否"))]),t._v(" "),e("p",[t._v("上映日期："+t._s(t.movieDetail.basic.releaseDate))]),t._v(" "),e("p",[t._v("上映国家 / 地区："+t._s(t.movieDetail.basic.releaseArea))]),t._v(" "),e("p",[t._v("综合评分："+t._s(-1===t.movieDetail.basic.overallRating?"暂无评分":t.movieDetail.basic.overallRating))]),t._v(" "),t.movieDetail.boxOffice.todayBoxDesUnit?e("p",[t._v(t._s(t.movieDetail.boxOffice.todayBoxDesUnit)+"："+t._s(t.movieDetail.boxOffice.todayBoxDes))]):t._e(),t._v(" "),t.movieDetail.boxOffice.totalBoxUnit?e("p",[t._v(t._s(t.movieDetail.boxOffice.totalBoxUnit)+"："+t._s(t.movieDetail.boxOffice.totalBoxDes))]):t._e(),t._v(" "),e("p",[t._v("预告片："),e("a",{on:{click:function(a){return t.video(t.movieDetail.basic.video.hightUrl)}}},[t._v("点击查看")])]),t._v(" "),e("a-popover",{attrs:{title:t.movieDetail.basic.director.name}},[e("template",{slot:"content"},[e("img",{staticStyle:{width:"140px",height:"180px"},attrs:{alt:"头像",src:t.movieDetail.basic.director.img}})]),t._v(" "),e("p",[t._v("导演："),e("a",[t._v(t._s(t.movieDetail.basic.director.name))])])],2),t._v(" "),e("div",{staticStyle:{"margin-bottom":".4rem"}},[t._v("\n                  主演：\n                  "),t._l(t.movieDetail.basic.actors,function(a,i){return[e("a-popover",{key:i,attrs:{title:a.name}},[e("template",{slot:"content"},[e("div",[e("p",{staticStyle:{"max-width":"140px"}},[t._v("扮演："+t._s(a.roleName?a.roleName:"未知 X_X"))]),t._v(" "),e("img",{staticStyle:{width:"140px",height:"180px"},attrs:{alt:"头像",src:a.img}})])]),t._v(" "),a.name?e("span",[0===i?e("span",[e("a",{staticStyle:{"margin-left":"-6px"}},[t._v(t._s(a.name))]),t._v(" · ")]):i===t.movieDetail.basic.actors.length-1?e("span",[e("a",[t._v(t._s(a.name))])]):e("span",[e("a",[t._v(t._s(a.name))]),t._v(" · ")])]):t._e()],2)]})],2)],1)],1),t._v(" "),e("a-row",[e("a-col",[e("a-divider",{attrs:{orientation:"left"}},[t._v("电影简介")]),t._v(" "),e("div",{staticStyle:{"text-indent":"1rem","margin-bottom":"2rem"}},[t._v(t._s(t.movieDetail.basic.story))])],1)],1)],1)])],1),t._v(" "),e("a-tab-pane",{key:"2",attrs:{tab:"电影评论"}},[e("div",[e("a-list",{attrs:{itemLayout:"horizontal",dataSource:t.comments},scopedSlots:t._u([{key:"renderItem",fn:function(a,i){return e("a-list-item",{},[e("a-list-item-meta",{attrs:{description:a.content}},[e("div",{attrs:{slot:"title"},slot:"title"},[t._v("\n                  "+t._s(a.nickname)+" \n                  "),e("span",{staticStyle:{color:"#aaa","font-weight":"400","font-size":"13px"}},[t._v(t._s(t.getDate(a.commentDate)))])]),t._v(" "),e("a-avatar",{attrs:{slot:"avatar",src:a.headImg},slot:"avatar"})],1)],1)}}])})],1)])],1)],1)],1)])},staticRenderFns:[]},o=e("VU/8")(i,s,!1,function(t){e("xKNn")},null,null);a.default=o.exports},xKNn:function(t,a){}});