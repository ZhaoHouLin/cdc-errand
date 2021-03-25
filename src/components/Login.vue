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
      
a.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='googleSignIn' v-if='!props.bool')
  | 疾管署 google帳號登入



</template>

<style lang='stylus'>
@css {
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md
  }
  .btn-green {
    @apply text-white bg-green-500 hover:bg-green-700
  }
  
}

.login-button
  cursor pointer  

</style>