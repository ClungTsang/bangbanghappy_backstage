webpackJsonp([41],{"F1q/":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),i=a.n(r),o=a("FJ7W"),n={data:function(){return{form:this.$form.createForm(this,{name:"dynamic_rule"})}},props:{addVisible:{type:Boolean,default:!1}},computed:{visible:function(){return this.addVisible}},methods:{handleOk:function(){var e=this;this.form.validateFields(function(t,a){t||e.$post("/question",i()({},a)).then(function(){e.$emit("close"),o.a.$emit("addCompleted"),e.form.resetFields()})})},handleCancel:function(){this.$emit("close")}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("a-modal",{attrs:{visible:e.visible,title:"新增问题"},on:{ok:e.handleOk,cancel:e.handleCancel}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"问题标题"}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["title"],expression:"['title']"}]})],1),e._v(" "),a("a-form-item",{attrs:{label:"问题解答"}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["detail"],expression:"['detail']"}]})],1),e._v(" "),a("a-form-item",{attrs:{label:"是否显示"}},[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["isDelete"],expression:"['isDelete']"}]},[a("a-radio",{attrs:{value:"0"}},[e._v("显示")]),e._v(" "),a("a-radio",{attrs:{value:"1"}},[e._v("不显示")])],1)],1)],1)],1)],1)},staticRenderFns:[]},s=a("VU/8")(n,l,!1,function(e){a("wsqn")},null,null);t.default=s.exports},wsqn:function(e,t){}});