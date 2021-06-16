webpackJsonp([5,38,47],{VOVG:function(t,e){},XhxA:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("FJ7W"),a={data:function(){return{slider:{value:20},rowList:[]}},props:{changeVisible:{type:Boolean,default:!1}},computed:{visible:function(){return this.changeVisible}},mounted:function(){var t=this;n.a.$on("selectedRows",function(e){t.rowList=e})},methods:{handleOk:function(){var t=this;this.rowList.forEach(function(e){t.$put("business/LantianStore",{id:e.id,spendpercent:t.slider.value+""})}),n.a.$emit("cleanSelectedRow"),this.$emit("close"),this.$message.success("修改抽成成功")},handleCancel:function(){this.$emit("close")}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("a-modal",{attrs:{visible:t.visible,title:"批量修改抽成"},on:{ok:t.handleOk,cancel:t.handleCancel}},[i("a-form",[i("a-form-item",{attrs:{label:"滑动批量修改门店的抽成比例"}},[i("a-row",[i("a-col",{attrs:{span:20}},[i("a-slider",{attrs:{min:1,max:99},model:{value:t.slider.value,callback:function(e){t.$set(t.slider,"value",e)},expression:"slider.value"}})],1),t._v(" "),i("a-col",{attrs:{span:4}},[i("a-input-number",{staticStyle:{marginleft:"16px"},attrs:{min:1,max:99},model:{value:t.slider.value,callback:function(e){t.$set(t.slider,"value",e)},expression:"slider.value"}})],1)],1)],1)],1)],1)],1)},staticRenderFns:[]},o=i("VU/8")(a,s,!1,function(t){i("VOVG")},null,null);e.default=o.exports},aDIY:function(t,e){},"j+61":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("XhxA"),a=i("8wwu"),s={data:function(){return{distributionAdd:{visible:!1},distributionChange:{visible:!1}}},components:{DistributionInfo:i("mcDV").default,DistributionAdd:a.default,DistributionChange:n.default},methods:{openAddDistribution:function(){this.distributionAdd.visible=!0},closeAddDistribution:function(){this.distributionAdd.visible=!1},openChangeDistribution:function(){this.distributionChange.visible=!0},closeChangeDistribution:function(){this.distributionChange.visible=!1}}},o={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a-card",{attrs:{bordered:!1}},[i("div",[i("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:["distribution:add"],expression:"['distribution:add']"}],attrs:{type:"primary"},on:{click:t.openAddDistribution}},[t._v("新增门店")]),t._v(" "),i("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:["distribution:change"],expression:"['distribution:change']"}],attrs:{type:"success"},on:{click:t.openChangeDistribution}},[t._v("批量修改抽成")]),t._v(" "),i("distribution-add",{attrs:{addVisible:t.distributionAdd.visible},on:{close:t.closeAddDistribution}}),t._v(" "),i("distribution-change",{attrs:{changeVisible:t.distributionChange.visible},on:{close:t.closeChangeDistribution}}),t._v(" "),i("distribution-info")],1)])},staticRenderFns:[]},r=i("VU/8")(s,o,!1,function(t){i("qo87")},null,null);e.default=r.exports},mcDV:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Dd8w"),a=i.n(n),s=i("FJ7W"),o=i("SGdj"),r=i("1XNc"),d=i("8wwu"),l={onChange:function(t,e){},onSelect:function(t,e,i){s.a.$emit("selectedRows",i)},onSelectAll:function(t,e,i){s.a.$emit("selectedRows",e)}},c=[{title:"门店编号",dataIndex:"id",width:100,align:"center"},{title:"门点名称",dataIndex:"companyname",width:200,ellipsis:!0,align:"center"},{title:"门店地址",dataIndex:"address",width:300,ellipsis:!0,align:"center"},{title:"联系人",dataIndex:"storeowner",width:150,align:"center"},{title:"老板电话",dataIndex:"bossmobilenumber",width:150,align:"center"},{title:"门店电话",dataIndex:"storephone",width:150,align:"center"},{title:"抽成比例",dataIndex:"spendpercent",align:"center"},{title:"门店状态",dataIndex:"storestatus",align:"center",width:100,scopedSlots:{customRender:"storestatus"}},{title:"操作",dataIndex:"showInfo",align:"center",scopedSlots:{customRender:"showInfo"},fixed:"right"}],u={components:{EditableCell:o.a,DistributionStoreInfo:r.default,DistributionAdd:d.default},data:function(){return{dataSource:[],columns:c,selectedRowKeys:[],pagination:{},loading:!1,storeInfoVisible:!1,id:null,changeVisible:!1,changeTarget:0,rowSelection:l}},computed:{hasSelected:function(){return this.selectedRowKeys.length>0}},mounted:function(){var t=this;this.fetch(),s.a.$on("cleanSelectedRow",function(){t.selectedRowKeys=[]}),s.a.$on("mallChangeDone",function(){t.fetch()})},methods:{changeStatus:function(t,e){var i=this,n={storestatus:t,id:e.id};this.$put("/business/LantianStore",a()({},n)).then(function(){i.$message.success("切换成功")})},onStatusChange:function(t){},handleTableChange:function(t,e,i){var n=a()({},this.pagination);n.current=t.current,this.pagination=n,this.fetch(a()({pageSize:t.pageSize,pageNum:t.current,sortField:i.field,sortOrder:i.order},e))},fetch:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0;var i=this.$db.get("USER_TOKEN"),n=this.$db.get("USER");"一级代理"==n.description||"一级代理"==n.roleName?this.$get("/business/LantianStore/getByPhone/"+n.username).then(function(n){if(n.data.data&&200==n.data.code)return t.$get("/business/LantianStore/MapAllByStoreid",a()({Authentication:i,pageSize:10,Parentid:n.data.data.id},e)).then(function(e){if(e.data.data){var i=a()({},t.pagination);i.total=e.data.data.total,t.dataSource=e.data.data.rows,t.pagination=i}})}):this.$get("/business/LantianStore/MapAll",a()({Authentication:i,pageSize:10},e)).then(function(e){var i=a()({},t.pagination);i.total=e.data.data.total,t.loading=!1,t.dataSource=e.data.data.rows,t.pagination=i}),this.loading=!1},showInfoModal:function(t){this.storeInfoVisible=!0,this.id=t.id},onClose:function(){this.storeInfoVisible=!1,this.changeVisible=!1},changeMallModal:function(t){this.changeTarget=t.id,this.changeVisible=!0}}},h={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("a-table",{attrs:{columns:t.columns,dataSource:t.dataSource,pagination:t.pagination,loading:t.loading,"row-selection":t.rowSelection},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"storestatus",fn:function(e,n){return i("span",{},[t._v("\n      "+t._s(0==e?"不营业":1==e?"关店":2==e?"休店":3==e?"开店":"异常")+"\n    ")])}},{key:"showInfo",fn:function(e,n){return i("span",{},[i("a",{on:{click:function(e){return t.showInfoModal(n)}}},[t._v("查看")]),t._v(" "),i("a-divider",{attrs:{type:"vertical"}}),t._v(" "),i("a",{on:{click:function(e){return t.changeMallModal(n)}}},[t._v("修改")])],1)}}])}),t._v(" "),i("distribution-store-info",{attrs:{infoVisible:t.storeInfoVisible,id:t.id},on:{close:t.onClose}}),t._v(" "),i("distribution-add",{attrs:{addVisible:t.changeVisible,id:t.changeTarget},on:{close:t.onClose}})],1)},staticRenderFns:[]},f=i("VU/8")(u,h,!1,function(t){i("aDIY")},null,null);e.default=f.exports},qo87:function(t,e){}});