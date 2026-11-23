const url = 'https://itunes.apple.com/lookup?id='
const endpointAlbum = '&entity=album'
async function get(){
    try{
        const resoponse = await fetch(`${url}909253 ${endpointAlbum}
`)
        const data = await resoponse.json()
        console.log(data)
    }catch(err){
        console.error(err)
    }
}
get()