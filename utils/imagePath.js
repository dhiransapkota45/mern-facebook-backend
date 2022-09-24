const imagePath = (array) => {
    console.log("reached here");
    
    for(let i in array){

        if(array[i].postImage || array[i].profile_pic){
            array[i].postImage = `http://localhost:8000/${array[i].postImage ? array[i].postImage : array[i].profile_pic}`
        }
      }
      return array
}

module.exports = imagePath