webpackJsonp([13,39],{"4xIq":function(t,e){},NuRl:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Dd8w"),i=a.n(n),s=[{title:"订单编号",dataIndex:"outTradeNo",width:130,align:"center"},{title:"客户电话",width:100,dataIndex:"publishUserNamemobile",align:"center"},{title:"订单分类",width:100,dataIndex:"classifyName",align:"center"},{title:"订单标题",width:100,dataIndex:"title",align:"center"},{title:"订单创建时间",width:100,dataIndex:"createtime",align:"center"},{title:"状态",width:50,dataIndex:"aidorderstatus",filters:[{text:"待付款",value:"1"},{text:"待援助",value:"2"},{text:"援助中",value:"3"},{text:"处理中",value:"4"},{text:"已完成",value:"5"},{text:"已取消",value:"6"},{text:"已关闭",value:"7"}],align:"center",scopedSlots:{customRender:"aidorderstatus"}},{title:"操作",width:120,dataIndex:"action",align:"center",scopedSlots:{customRender:"action"}}],o={components:{AssistInfoModal:a("JhYp").default},data:function(){return{columns:s,dataSource:[],pagination:{},loading:!1,selectedRowKeys:[],assistInfoShow:!1,id:null}},mounted:function(){this.fetch()},methods:{handleTableChange:function(t,e,a){var n=i()({},this.pagination);n.current=t.current,this.pagination=n,this.fetch(i()({pageSize:t.pageSize,pageNum:t.current},e))},fetch:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0;var a=this.$db.get("USER_TOKEN");this.$get("/aidOrder/list",i()({Authentication:a,pageSize:10},e)).then(function(e){var a=i()({},t.pagination);a.total=e.data.data.total,t.loading=!1,t.dataSource=e.data.data.rows,t.pagination=a})},onChange:function(t,e){var a=this,n={aidorderstatus:t,id:e.id};this.$post("/aidOrder/updateByAidorderstatus",i()({},n)).then(function(){a.$message.success("切换成功")})},onSelectChange:function(t){this.selectedRowKeys=t},onCloseAssistShowModal:function(){this.assistInfoVisible=!1},onCancelAssistShowModal:function(){this.assistInfoVisible=!1},confirmDelete:function(t){var e=this;this.$get("/aidOrder/delete",{id:t.id}).then(function(){var a=e.dataSource.filter(function(e){return e.id!==t.id});e.dataSource=a})},showInfoModal:function(t){this.id=t.id,this.assistInfoShow=!0},onClose:function(){this.assistInfoShow=!1},confirmClose:function(t){var e=this,a={aidorderstatus:7,id:t.id};this.$post("/aidOrder/updateByAidorderstatus",i()({},a)).then(function(){e.$message.success("关闭订单成功")})},confirmOk:function(t){var e=this,a={aidorderstatus:5,id:t.id};this.$post("/aidOrder/updateByAidorderstatus",i()({},a)).then(function(){e.$message.success("完成订单成功")})}}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("a-table",{attrs:{dataSource:t.dataSource,columns:t.columns,pagination:t.pagination,loading:t.loading},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"aidorderstatus",fn:function(e,n){return a("span",{},[t._v("\n      "+t._s(1==e?"待付款":2==e?"待援助":3==e?"援助中":4==e?"处理中":5==e?"已完成":6==e?"已取消":"已关闭")+"\n      "),a("a-divider",{attrs:{type:"vertical"}}),t._v(" "),a("a-select",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:["order:change"],expression:"['order:change']"}],staticStyle:{width:"100px"},attrs:{"default-value":"快速切换"},on:{change:function(e){t.onChange(e,n)}}},[a("a-select-option",{attrs:{value:"1"}},[t._v("待付款")]),t._v(" "),a("a-select-option",{attrs:{value:"2"}},[t._v("待援助")]),t._v(" "),a("a-select-option",{attrs:{value:"3"}},[t._v("援助中")]),t._v(" "),a("a-select-option",{attrs:{value:"4"}},[t._v("处理中")]),t._v(" "),a("a-select-option",{attrs:{value:"5"}},[t._v("已完成")]),t._v(" "),a("a-select-option",{attrs:{value:"6"}},[t._v("已取消")]),t._v(" "),a("a-select-option",{attrs:{value:"7"}},[t._v("已关闭")])],1)],1)}},{key:"action",fn:function(e,n){return a("span",{},[a("a-popconfirm",{attrs:{title:"确定完成该订单","ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.confirmOk(n)}}},[a("a",[t._v("完成订单")])]),t._v(" "),a("a-divider",{attrs:{type:"vertical"}}),t._v(" "),a("a-popconfirm",{attrs:{title:"确定关闭该订单","ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.confirmClose(n)}}},[a("a",[t._v("关闭订单")])]),t._v(" "),a("a-divider",{attrs:{type:"vertical"}}),t._v(" "),a("a",{on:{click:function(e){return t.showInfoModal(n)}}},[t._v("查看")])],1)}}])}),t._v(" "),a("assist-info-modal",{attrs:{infoVisible:t.assistInfoShow,id:t.id},on:{close:t.onClose}})],1)},staticRenderFns:[]},d=a("VU/8")(o,r,!1,function(t){a("4xIq")},null,null);e.default=d.exports},n2vU:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={components:{AssistCategoryInfo:a("NuRl").default}},i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("a-card",{attrs:{bordered:!1}},[e("div",[e("assist-category-info")],1)])},staticRenderFns:[]},s=a("VU/8")(n,i,!1,function(t){a("plTp")},null,null);e.default=s.exports},plTp:function(t,e){}});