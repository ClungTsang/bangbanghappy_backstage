webpackJsonp([74],{MY2p:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("fZjL"),i=a.n(s),r=a("Dd8w"),n=a.n(r),d=a("g4PW"),o=a.n(d),l={labelCol:{span:3},wrapperCol:{span:18}},c={name:"DeptAdd",props:{deptAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:l,form:this.$form.createForm(this),dept:{},checkedKeys:[],expandedKeys:[],deptTreeData:[],deptTreeKeys:+new Date}},methods:{reset:function(){this.loading=!1,this.deptTreeKeys=+new Date,this.expandedKeys=this.checkedKeys=[],this.dept={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},handleExpand:function(e){this.expandedKeys=e},handleSubmit:function(){var e=this,t=o()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;t.length>1?this.$message.error("最多只能选择一个上级部门，请修改"):this.form.validateFields(function(a,s){a||(e.setDeptFields(),e.loading=!0,t.length?e.dept.parentId=t[0]:e.dept.parentId="",e.$post("dept",n()({},e.dept)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})},setDeptFields:function(){var e=this,t=this.form.getFieldsValue(["deptName"]);void 0!==t&&i()(t).forEach(function(a){e.dept[a]=t[a]})}},watch:{deptAddVisiable:function(){var e=this;this.deptAddVisiable&&this.$get("dept").then(function(t){e.deptTreeData=t.data.rows.children})}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增部门",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.deptAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"部门名称"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["deptName",{rules:[{required:!0,message:"部门名称不能为空"},{max:20,message:"长度不能超过20个字符"}]}],expression:"['deptName',\n                 {rules: [\n                  { required: true, message: '部门名称不能为空'},\n                  { max: 20, message: '长度不能超过20个字符'}\n                ]}]"}]})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"部门排序"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{staticStyle:{width:"100%"},model:{value:e.dept.orderNum,callback:function(t){e.$set(e.dept,"orderNum",t)},expression:"dept.orderNum"}})],1),e._v(" "),a("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级部门"}},"a-form-item",e.formItemLayout,!1),[a("a-tree",{key:e.deptTreeKeys,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,treeData:e.deptTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},p=a("VU/8")(c,m,!1,null,null,null);t.default=p.exports}});