//引入封装面包屑导航
import Bread from '../../bread/bread.vue'
export default {
    data() {
        return {
            tableData:[],
        }
    },
    components : {Bread},
    methods : {
        getList() {
            this.$http({
                method : 'GET',
                url : 'http://localhost:8888/api/private/v1/rights/list',
            }).then(res=>{
                // console.log(res);
                let { data , meta} = res.data
                if(meta.status === 200 ){
                    this.tableData = data
                }
            }).catch(err=>{})
        }
    },
    mounted() {
        this.getList()
    }
}