<script>
import { GoogleSpreadsheet } from "google-spreadsheet"
import { computed, onMounted, reactive, ref } from 'vue'
import { googleFireStore , googleFirebase } from '../db'
export default {
  props: {
    bool: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: ()=> ({}) 
    }
  },
  emits: {
    emitAuthState: (authState)=> {
      return authState
    },
  },
  setup(props,{emit}) {

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet('12ZywtwsXYDCv1j9fzDZQkrX6r3k7dnwZMyci122bcMo')
    const sheet = ref()
    const a1 = ref()
    const title = ref('')
    const rows = ref()
    const userKeyTitle = ref('')

    const time = reactive({})

    const authState = ref(false)

    const userData = ref()

    const getLocation = () => {                         
      if ('geolocation' in navigator) {                 //測試地理位置定位是否存在
        navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
          let latitude = pos.coords.latitude
          let longitude = pos.coords.longitude

        })
      }
    }

    const getTime = ()=> {
      // time.fullYear = new Date().getFullYear()
      // time.month = new Date().getMonth()+1
      // time.date = new Date().getDate()
      // time.day = new Date().getDay()

      // time.hours = new Date().getHours()
      // time.minutes = new Date().getMinutes() 
      // time.seconds = new Date().getSeconds()
      // time.milliseconds = new Date().getMilliseconds()
      time.localDate = new Date().toLocaleDateString()
      time.loaclTime = new Date().toLocaleTimeString()
      console.log(time)
    }

    const handleAuthState = ()=> {
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          authState.value = true
          emit('emitAuthState',authState)
        } else {
          authState.value = false
          emit('emitAuthState',authState)
          console.log(authState.value);
        }
      })
    }

    const handleSignOut = ()=> {
      googleFirebase.auth().signOut().then(() => {
        console.log('Sign-out successful.');
        userData.value = googleFirebase.auth().currentUser
        time.localDate = ''
        time.loaclTime = ''
        handleAuthState()
      }).catch((error) => {
        // An error happened.
      });
    }

    const changeTitle = ()=> {
      doc.updateProperties({ title: userKeyTitle.value })
    }

    const f = async ()=> {
      
      // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({
        client_email: 'demo-dialogflowapi@fir-1e4d8.iam.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCiyLulqfxaz2IQ\nuPOGPpc1JBVtYnAdKowteTNdIClQGj/UsmAAJfSD6Z2Hqh0Ii2q5SbyQyX0PtoQK\nkMzXd/9aGPxNzrOzF5GN4Qjl0WKLOnAnODyzioy1V70oFXEYpljZFIJ2NS5zT8MS\nHZHZENVI8uXELanPgMzQvEuc3lkURrX2eO5e3CR2fDfsgOJ4XM7q0ZD38RolcwDP\nfNd5RHcSrVJrNnlEs2JHu24aVTgqN7YJ9b/k3F4gRW+YcZMy1+HYjqCXpntZ0OX3\nJ1gbWrE4G9Bf5LSsd7TbnfiO7wf6qZ/qGGtXMb62ewsDWtWdO+MVBwEQRQ8iCULL\nqGtbmW6PAgMBAAECggEAK0f15IFC0J5NM6cJUMs5hu6WJ+RBbO/QH5MXHg6cDWk9\nSX832TI+RgiKUvTfDVOMR8GcOl7oOpJLn0eKv0tvgHQeOU3ZJ6f/klqf9ALtEZmz\nEip4sUAIU3sFly/ER0qLWwSB/436ULyHYDyud6lrHB9BCh0eBkb3rhQygn3371TE\ntlyFyXCHLAf3uMt7/I/EuqdRWipxJK4iadSC92azn2JZ7Rp04ywx0ZDQczuHFfFj\n/gvpjtFwbVNrgkv/zk6g5KD2WIZvT9kIzYlGJL4qLRHBPjkJ07VieQS41oREMwzS\nLnCDK0K6ER+5p7nYbPzg3l3eTWeSgWrO1SlK171bKQKBgQDfKjC/Ai4fFEfKaL0D\n6LJdwwdMDoLQVL39cBZNOoyAi/xl+1htzRNyBu373tWr83zhjL6s9sYvUVPwecJB\n8zuTXahbsrmDhajq+2rvcQJCfOvxMz18JcsFqEtYHihK3Of+xTXwzG+fG0Pavptg\nRokiESZVLBHwkrCAQh+fVTwz9QKBgQC6vDh+BWSKKFFuuRAfJP6AsWAqtbC0SHQm\nD1UxOvKgPdJMVi5RyVK8DsD80SWDaBne2txBtjq/GO6iVvIpj+h6ruFZCzrOZPrw\n+FOPYJqmAxLduGUbsLf2/fmVXA9KKj5uP6/BKuXGZsjX+wDzdAhkndHDsAvsdkN/\nYffda06J8wKBgQDXQ8pLpZ25qwVpEMkq6R6M5SC309OJhATUYHeSvWRkZyPrd50g\nJU6ZkmejqppvyGpw4yPWkiAv6oJOmBSzKx4Pk6tf8LGUVazQJf9LwrXMTtYFD0lC\n5O3GokUzVbvGIvrCPZc/lOQjFNjKO0yDfOaw7twMEnunlMgeoCoCtuRgtQKBgE5/\nnUfswG0Lsd/X0B0nkg1Lg1+w7U18P8dYHroJS8Fs+6C3gdVDypHfqeUdjqWE94sl\nef3tuxhmRLrdzgMGyfX42iZygBAPhyYRXh8hvyEWnbGzOF3BljQwY+ETyCGnTINQ\nJnQPsnQK9VdF3wp4tqaFaY7XzMtkk89Swb3ExEldAoGBAJ8RIWKWyjblJS6OGt9E\nX357BAvaRTjl5pgqG/4ojtipeEwQo68jBwNYLvSamAwpppvSPoXV1deF9Xr9v/1M\nestO7NWT3qB00TEk4AFAcLdkcTsE+jxm5PeMdxqyY5erDKvTsBlSFY9UQUQdvZzc\nJ3ztlJYidV7bXlQFwiuLPodW\n-----END PRIVATE KEY-----\n",
      });
      
      await doc.loadInfo() // loads document properties and worksheets
      // await doc.updateProperties({ title: 'test doc' });
      
      sheet.value = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
      // console.log(sheet.value.title);
      // console.log('sheet',sheet.value);
      title.value = doc
      await sheet.value.loadCells('A1:E10')
      const cellA1 = await sheet.value.getCell(0, 0)
      const cellC3 = sheet.value.getCellByA1('C3')
      // adding / removing sheets
      // const newSheet = await doc.addSheet({ title: 'zz' });
      // await newSheet.delete()

      // create a sheet and set the header row
      // sheet.value = await doc.addSheet({ headerValues: ['name', 'email'] });
      // sheet.value = doc.sheetsById[996985920]
      // append rows
      title.value = cellC3.value
      console.log(cellC3);
      const sendData = await sheet.value.addRow({ 
        name: props.data.name, 
        email: props.data.email ,
        date: time.localDate,
        time: time.loaclTime
      });


      // rows.value = await sheet.value.getRows(); // can pass in { limit, offset }

      // read/write row values
      // console.log(rows[0].name);
      // rows[1].email = 'sergey@abc.xyz'; // update a value
      // await rows[1].save(); // save updates
      // await rows[1].delete(); // delete a row

    }

    onMounted(()=> {

    })

    return {
      sheet,
      a1,
      title,
      userKeyTitle,
      changeTitle,
      rows,
      props,
      f,
      getTime,
      time,
      handleSignOut
    }
  }

}
</script>

<template lang='pug'>
.edit-sheet(v-if='props.bool')
  h1 {{props.data.name}}
  h2 {{time.localDate}}
  h2 {{time.loaclTime}}
  //- input(@input='changeTitle' v-model='userKeyTitle')
  button(@click='f(),getTime()') 打卡
  button(@click='handleSignOut') 登出
</template>

<style lang="stylus">

</style>
