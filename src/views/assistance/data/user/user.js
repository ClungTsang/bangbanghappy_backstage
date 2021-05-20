const user = {
  _getUserCustomer() {
    return this.$get("/wechatcustomer")
  },
  _getTest() {
    return this.$get()
  }
}
export default user
