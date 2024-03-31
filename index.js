
const admin = require('firebase-admin')
const serviceAccount = require('./functions/chaveFastDocs.json')
const { v4: uuidv4 } = require('uuid')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'fast-docs.appspot.com'
});
const bucket = admin.storage().bucket();


// bucket.upload('./recibo.pdf', {
//     destination: 'recibo.pdf',
//     metadata: {
//         metadata: {firebaseStorageDownloadTokens: uuidv4()}
//     }
// }).then(res=>{
//     console.log(res)
//     // onSuccess(res)
// }).catch(err=>{
//     console.log(err)
//     // onError(err)
// })

bucket.getFiles().then(res=>{
    let [files] = res
    const options = {
        version: 'v2',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60, // one hour
      };
    files.forEach( file => {
        console.log(file.name)
        async  function getUrl(options){
            console.log(await file.getSignedUrl(options))
        }
        getUrl(options)
    })
    // onSuccess(res)
}).catch(err=>{
    console.log(err)
    // onError(err)
})