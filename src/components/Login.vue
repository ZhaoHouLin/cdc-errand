<script>
import { googleFireStore , googleFirebase } from '../db'
import { onMounted, reactive, ref } from 'vue'
// import { apiSignUpPage, apiSignInPage } from '../api'

export default {
  props: {
    bool: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    emitAuthState: (authState)=> {
      return authState
    },
    emitData: (data)=> {
      return data
    }
  },

  setup(props,{emit}) {

    const open = ref(true)
    let cover = ref()
    let userEmail = ref('')
    let userPassword = ref('')

    let errorMsg = ref('')

    const authState = ref(false)

    const loginUserInfo = reactive({})

    const userSignUp = reactive({
      email: '',
      password: ''
    })

    const userSignIn = reactive({
      email: '',
      password: ''
    })

    const userData = ref()

    const gotoNewRouter = () => {    //自建函式來切換指定頁面
      router.push({path: `/editsheet`})
    }

    const handleAuthState = ()=> {
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          authState.value = true
          emit('emitAuthState',authState)
        } else {
          authState.value = false
          emit('emitAuthState',authState)
        }
      })
    }

    const handleSignUp = (e)=> {
      e.preventDefault()
      userSignUp.email = userEmail.value
      userSignUp.password = userPassword.value

      googleFirebase.auth().createUserWithEmailAndPassword(userSignUp.email, userSignUp.password)
        .then(u => {
          googleFireStore.collection('profiles').doc(u.user.uid).set({
            name: userSignUp.email,
            password: userSignUp.password
          }).then(()=> {
            console.log('User created successfully');
            userEmail.value = ''
            userPassword.value = ''
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
          errorMsg.value = err.message
        })
    }

    const handleSignIn = (e)=> {
      handleSignOut()
      e.preventDefault()
      userSignIn.email = userEmail.value
      userSignIn.password = userPassword.value
      googleFirebase.auth().signInWithEmailAndPassword(userSignIn.email,userSignIn.password)
        .then(()=> {
          userData.value = googleFirebase.auth().currentUser
          // if(userData.value) console.log(userSignIn);
          handleAuthState()
          userEmail.value = ''
          userPassword.value = ''
        }).catch(err => {
          console.log(err.message);
          errorMsg.value = err.message
        })
    }

    const googleSignIn = ()=> {
      handleSignOut()
      let provider = new googleFirebase.auth.GoogleAuthProvider()
      googleFirebase.auth().languageCode = 'it';
      // To apply the default browser preference instead of explicitly setting it.
      // firebase.auth().useDeviceLanguage();
      googleFirebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          userData.value = googleFirebase.auth().currentUser
          loginUserInfo.data = result.additionalUserInfo.profile
          emit('emitData',loginUserInfo.data)
          handleAuthState()
        })
        .catch((error) => {
          // Handle Errors here.
          errorMsg.value = error.message

        });
    }

    const handleSignOut = ()=> {
      googleFirebase.auth().signOut().then(() => {
        console.log('Sign-out successful.');
        userData.value = googleFirebase.auth().currentUser
        handleAuthState()
      }).catch((error) => {
        // An error happened.
      });
    }

    const handleOpen = (e)=> {
      userEmail.value = ''
      userPassword.value = ''
      if(open.value) {
        // console.log('cover',cover);
        apiSignUpPage(cover.value)
        open.value = !open.value
      } else {
        apiSignInPage(cover.value)
        open.value = !open.value
      }
    }

    onMounted(()=> {
      
    })

    return {
      userEmail,
      userPassword,
      handleSignUp,
      handleSignIn,
      googleSignIn,
      handleSignOut,
      authState,
      handleOpen,
      cover,
      gotoNewRouter,
      errorMsg,
      props
    }
  }
}
</script>

<template lang='pug'>


.card(v-if='!props.bool')
  .wordLeft
    h2 Welcome Back
    p To keep connect with up please login with your personal info
    label(for="changePage") Sign In
  .wordRight
    h2 Hello Friend!
    p Enter your personal details and start journey with us
    label(for="changePage") Sign Up
  form(action="/users/login" method="").loginPage  
    h1 Log In
    .group
      label(for="email").far.fa-envelope
      input(type="email" name="email" placeholder='Email' v-model='userEmail')
    .group
      label(for="password").fas.fa-key
      input(type="password" name="password" placeholder='password' v-model='userPassword')
    .group
      button#login(type='submit' @click='handleSignIn') login
      //- router-link(to="/editsheet") EditSheet
      //- a.fab.fa-facebook(@click='facebookSignIn')
      a.fab.fa-google-plus-g(@click='googleSignIn') G
      //- router-link.fab.fa-google-plus-g(to="/editsheet" @click='googleSignIn') G
        
  form(action="/users/register" method="").registerPage
    h1(v-if='!errorMsg') Create Account
    h1(v-if='errorMsg') {{errorMsg}}
    //- .group
    //-   label(for="name").fas.fa-signature
    //-   input(type="text" name="name" placeholder='name')
    .group
      label(for="email").far.fa-envelope
      input#email(type="email" name="email" placeholder='Email' v-model='userEmail')
    .group
      label(for="password").fas.fa-key
      input#pwd(type="password" name="password" placeholder='password' v-model='userPassword')
    //- .group
    //-   label(for="password2").fas.fa-key
    //-   input(type="password" name="password2" placeholder=' confirm password')
    button#submit(type='submit' @click='handleSignUp') Register
  .cover(ref='cover')
    button#changePage(name="changePage" @click='handleOpen')

</template>

<style lang='stylus'>
@import '../css/style.styl'
$color_brown= #9b4b4b
.card
  box-shadow 2px 2px 4px rgba(0,0,0,0.5)
  size(800px,480px,8px)
  overflow hidden
  position relative
  
  .wordLeft,.wordRight
    background-color transparent
    flexCenter()
    text-align center
    height 200px
    margin-top 100px
    z-index 4
    color #fff
    position absolute
    padding 16px
    label
      color $color_brown
      font-weight 900
      position absolute
      margin-top 239px
      
  .wordLeft
    width 300px
    flex-direction column
    margin-left -300px
    // p
    //   padding 16px

  .wordRight
    right 0
    width 300px
    flex-direction column
   
  .loginPage,.registerPage
    color $color_brown
    z-index 3
    flexCenter()
    flex-direction column
    text-align center
    position absolute
    size(500px,480px,0px)
    #login,#submit
      margin-top 4px
      size(100px,40px,16px)
      border none
      color #fff
      background-color $color_brown
      cursor pointer
      
    .fab.fa-facebook,.fab.fa-google-plus-g
      flexCenter()
      text-decoration none
      margin-top 8px
      font-size 24px
      size(100px,40px,16px)
      color #fff
      background-color $color_brown
      cursor pointer
    .group
      margin 8px
      label
        margin-right 4px
  .registerPage
    right 0
    opacity 0

  .cover
    z-index 3
    flexCenter()
    flex-direction column
    size(300px,480px,0px)
    position absolute
    right 0px
    background-color $color_brown
    color #fff
    #changePage
      position absolute
      size(100px,40px,16px)
      border none
      margin-top 160px
      color $color_brown
      background-color #fff
      font-size 20px
</style>