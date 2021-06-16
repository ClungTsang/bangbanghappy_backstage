webpackJsonp([29],{GWT0:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("Dd8w"),r=a.n(n),i=a("NYxO"),s={name:"Online",data:function(){return{advanced:!1,dataSource:[],queryParams:{},pagination:{defaultPageSize:1e7,hideOnSinglePage:!0,indentSize:100},loading:!1}},computed:r()({columns:function(){return[{title:"用户名",dataIndex:"username",scopedSlots:{customRender:"username"}},{title:"登录时间",dataIndex:"loginTime"},{title:"登录IP",dataIndex:"ip"},{title:"登录地点",dataIndex:"loginAddress"},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"},fixed:"right",width:120}]}},Object(i.c)({user:function(e){return e.account.user}})),mounted:function(){this.fetch()},methods:{search:function(){this.fetch(r()({},this.queryParams))},kickout:function(e){var t=this;this.$confirm({title:"确定踢出该用户?",content:"当您点击确定按钮后，该用户的登录将会马上失效",centered:!0,onOk:function(){t.$delete("kickout/"+e.id).then(function(){t.$message.success("踢出用户成功"),t.user.id===e.id?(t.$db.clear(),location.reload()):t.search()}).catch(function(e){t.$message.error("踢出用户失败")})}})},reset:function(){this.queryParams={},this.fetch()},handleTableChange:function(e,t,a){this.fetch(r()({},this.queryParams))},fetch:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.$get("online",r()({},t)).then(function(t){var a=t.data.data;e.loading=!1,e.dataSource=a})}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[a("div",{class:e.advanced?"search":null},[a("a-form",{attrs:{layout:"horizontal"}},[a("div",{class:e.advanced?null:"fold"},[a("a-row",[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"用户名",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.username,callback:function(t){e.$set(e.queryParams,"username",t)},expression:"queryParams.username"}})],1)],1)],1)],1),e._v(" "),a("span",{staticStyle:{float:"right","margin-top":"3px"}},[a("a-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:e.reset}},[e._v("重置")])],1)])],1),e._v(" "),a("div",[a("a-table",{attrs:{columns:e.columns,rowKey:function(e){return e.id},dataSource:e.dataSource,pagination:e.pagination,loading:e.loading,scroll:{x:900}},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"username",fn:function(t,n){return[n.id===e.user.id?[e._v("\n          "+e._s(n.username)+"  "),a("a-tag",{attrs:{color:"pink"}},[e._v("current")])]:[e._v("\n          "+e._s(n.username)+"\n        ")]]}},{key:"operation",fn:function(t,n){return[a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:["user:kickout"],expression:"['user:kickout']"}],staticStyle:{color:"#f95476"},attrs:{type:"poweroff",title:"踢出"},on:{click:function(t){return e.kickout(n)}}}),e._v(" "),a("a-badge",{directives:[{name:"hasNoPermission",rawName:"v-hasNoPermission",value:["user:kickout"],expression:"['user:kickout']"}],attrs:{status:"warning",text:"无权限"}})]}}])})],1)])},staticRenderFns:[]},c=a("VU/8")(s,o,!1,function(e){a("z0ta")},"data-v-7f96aef2",null);t.default=c.exports},z0ta:function(e,t){}});